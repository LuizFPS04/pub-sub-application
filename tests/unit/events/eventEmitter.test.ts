import { EventEmitter } from 'events';
import { Server } from 'socket.io';
import { appEvents } from '../../../src/events/eventEmitter';
import * as notificationService from '../../../src/services/notification.service';
import * as teamService from '../../../src/services/team.service';
import * as userService from '../../../src/services/user.service';
import { mockMatch, mockUser, mockTeam } from '../../mocks';

// Mocks
jest.mock('../../../src/services/notification.service');
jest.mock('../../../src/services/team.service');
jest.mock('../../../src/services/user.service');
jest.mock('socket.io');

const mockedNotificationService = notificationService as jest.Mocked<typeof notificationService>;
const mockedTeamService = teamService as jest.Mocked<typeof teamService>;
const mockedUserService = userService as jest.Mocked<typeof userService>;
const MockedServer = Server as jest.MockedClass<typeof Server>;

describe('Event Emitter', () => {
  let mockIo: jest.Mocked<Server>;
  let mockSocket: any;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockSocket = {
      handshake: { query: { userId: 'user123' } },
      join: jest.fn(),
      on: jest.fn(),
      id: 'socket123'
    };

    mockIo = {
      on: jest.fn(),
      to: jest.fn().mockReturnThis(),
      emit: jest.fn(),
    } as any;

    MockedServer.mockImplementation(() => mockIo);
  });

  describe('newMatch event', () => {
    it('should emit newMatch event and create notifications for followed users', async () => {
      const match = {
        ...mockMatch,
        homeTeam: { id: 1, shortName: 'Flamengo' },
        awayTeam: { id: 2, shortName: 'Vasco' },
      };

      const homeTeam = { ...mockTeam, _id: 'team1', id: 1 };
      const awayTeam = { ...mockTeam, _id: 'team2', id: 2, name: 'Vasco', shortName: 'Vasco' };
      const followingUsers = [
        { ...mockUser, _id: 'user1' },
        { ...mockUser, _id: 'user2' }
      ];

      mockedTeamService.getTeamById
        .mockResolvedValueOnce(homeTeam as any)
        .mockResolvedValueOnce(awayTeam as any);
      
      mockedUserService.findUserFollowedTeams.mockResolvedValue(followingUsers as any);
      mockedNotificationService.createNotification.mockResolvedValue({} as any);

      // Emitir o evento
      appEvents.emit('newMatch', match);

      // Aguardar processamento assíncrono
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(mockedTeamService.getTeamById).toHaveBeenCalledWith(1);
      expect(mockedTeamService.getTeamById).toHaveBeenCalledWith(2);
      expect(mockedUserService.findUserFollowedTeams).toHaveBeenCalledWith(['team1', 'team2']);
      
      // Verifica se as notificações foram criadas para cada usuário
      expect(mockedNotificationService.createNotification).toHaveBeenCalledTimes(2);
      expect(mockedNotificationService.createNotification).toHaveBeenCalledWith({
        userId: 'user1',
        type: 'newMatch',
        message: '📢 Novo jogo: Flamengo × Vasco',
        teams: ['Flamengo', 'Vasco'],
        matchId: match._id
      });
    });

    it('should handle case when no users follow the teams', async () => {
      const match = {
        ...mockMatch,
        homeTeam: { id: 1, shortName: 'Flamengo' },
        awayTeam: { id: 2, shortName: 'Vasco' },
      };

      mockedTeamService.getTeamById
        .mockResolvedValueOnce({ _id: 'team1' } as any)
        .mockResolvedValueOnce({ _id: 'team2' } as any);
      
      mockedUserService.findUserFollowedTeams.mockResolvedValue(null);

      appEvents.emit('newMatch', match);
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(mockedNotificationService.createNotification).not.toHaveBeenCalled();
    });
  });

  describe('matchUpdated event', () => {
    it('should emit matchUpdated event with changed fields', async () => {
      const match = {
        ...mockMatch,
        homeTeam: { id: 1, shortName: 'Flamengo' },
        awayTeam: { id: 2, shortName: 'Vasco' },
        score: { home: 2, away: 1 },
        status: 'FINISHED'
      };
      const changedFields = ['score', 'status'];

      const homeTeam = { _id: 'team1' };
      const awayTeam = { _id: 'team2' };
      const followingUsers = [{ _id: 'user1' }];

      mockedTeamService.getTeamById
        .mockResolvedValueOnce(homeTeam as any)
        .mockResolvedValueOnce(awayTeam as any);
      
      mockedUserService.findUserFollowedTeams.mockResolvedValue(followingUsers as any);
      mockedNotificationService.createNotification.mockResolvedValue({} as any);

      appEvents.emit('matchUpdated', { match, changedFields });
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(mockedNotificationService.createNotification).toHaveBeenCalledWith({
        userId: 'user1'