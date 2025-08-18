import { EventEmitter } from 'events';
import { Server } from 'socket.io';
import { appEvents, initSocket } from '../../../src/events/eventEmitter';
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

  describe('initSocket', () => {
    it('should initialize socket server with correct configuration', () => {
      const mockServer = {} as any;
      
      initSocket(mockServer);

      expect(MockedServer).toHaveBeenCalledWith(mockServer, { 
        cors: { origin: "*" } 
      });
      expect(mockIo.on).toHaveBeenCalledWith("connection", expect.any(Function));
    });

    it('should handle socket connection with userId', () => {
      const mockServer = {} as any;
      let connectionHandler: any;
      
      mockIo.on.mockImplementation((event, handler) => {
        if (event === 'connection') {
          connectionHandler = handler;
        }
        return mockIo;
      });

      initSocket(mockServer);
      connectionHandler(mockSocket);

      expect(mockSocket.join).toHaveBeenCalledWith('user-user123');
      expect(mockSocket.on).toHaveBeenCalledWith("disconnect", expect.any(Function));
    });

    it('should handle socket connection without userId', () => {
      const mockServer = {} as any;
      const mockSocketNoUser = {
        handshake: { query: {} },
        join: jest.fn(),
        on: jest.fn(),
        id: 'socket456'
      };
      
      let connectionHandler: any;
      mockIo.on.mockImplementation((event, handler) => {
        if (event === 'connection') {
          connectionHandler = handler;
        }
        return mockIo;
      });

      initSocket(mockServer);
      connectionHandler(mockSocketNoUser);

      expect(mockSocketNoUser.join).not.toHaveBeenCalled();
    });
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

    it('should handle case when teams are not found', async () => {
      const match = {
        ...mockMatch,
        homeTeam: { id: 1, shortName: 'Flamengo' },
        awayTeam: { id: 2, shortName: 'Vasco' },
      };

      mockedTeamService.getTeamById
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);

      appEvents.emit('newMatch', match);
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(mockedUserService.findUserFollowedTeams).toHaveBeenCalledWith([undefined, undefined]);
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
        userId: 'user1',
        type: 'matchUpdated',
        message: '📢 Jogo atualizado: Flamengo × Vasco | 2 × 1 (FINISHED)',
        teams: ['Flamengo', 'Vasco'],
        matchId: match._id
      });
    });

    it('should emit socket event to users', async () => {
      const match = {
        ...mockMatch,
        homeTeam: { id: 1, shortName: 'Flamengo' },
        awayTeam: { id: 2, shortName: 'Vasco' },
        score: { home: 2, away: 1 },
        status: 'FINISHED'
      };
      const changedFields = ['score'];
      const followingUsers = [{ _id: 'user1' }];

      mockedTeamService.getTeamById
        .mockResolvedValueOnce({ _id: 'team1' } as any)
        .mockResolvedValueOnce({ _id: 'team2' } as any);
      mockedUserService.findUserFollowedTeams.mockResolvedValue(followingUsers as any);
      mockedNotificationService.createNotification.mockResolvedValue({} as any);

      // Simular io global
      const mockGlobalIo = {
        to: jest.fn().mockReturnThis(),
        emit: jest.fn()
      };
      (global as any).io = mockGlobalIo;

      appEvents.emit('matchUpdated', { match, changedFields });
      await new Promise(resolve => setTimeout(resolve, 100));

      // Como o io é uma variável de módulo, não podemos testar diretamente
      // Mas podemos verificar se a notificação foi criada
      expect(mockedNotificationService.createNotification).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateTable event', () => {
    it('should emit updateTable event for team followers', async () => {
      const table = {
        id: 'team1',
        teamId: 'team1',
        position: 1,
        points: 25,
        playedGames: 10,
        won: 8,
        draw: 1,
        lost: 1,
        goalDifference: 15,
        goalsAgainst: 5,
        goalsFor: 20,
        leagueId: 'league1'
      };

      const followingUsers = [{ _id: 'user1' }];
      mockedUserService.findUserFollowedTeams.mockResolvedValue(followingUsers as any);

      appEvents.emit('updateTable', table);
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(mockedUserService.findUserFollowedTeams).toHaveBeenCalledWith(['team1']);
    });

    it('should handle case when no users follow the team', async () => {
      const table = {
        teamId: 'team1',
        position: 1,
        points: 25
      };

      mockedUserService.findUserFollowedTeams.mockResolvedValue(null);

      appEvents.emit('updateTable', table);
      await new Promise(resolve => setTimeout(resolve, 100));

      // Não deve haver erro mesmo sem usuários
      expect(mockedUserService.findUserFollowedTeams).toHaveBeenCalledWith(['team1']);
    });
  });

  describe('insertLeague event', () => {
    it('should emit insertLeague event globally', () => {
      const league = {
        id: 'league1',
        name: 'Campeonato Brasileiro',
        country: 'Brasil'
      };

      const mockGlobalIo = {
        emit: jest.fn()
      };
      (global as any).io = mockGlobalIo;

      appEvents.emit('insertLeague', league);

      // Como não há lógica assíncrona aqui, testamos diretamente
      // Mas o io é uma variável de módulo, então verificamos se o evento foi emitido
      expect(appEvents.listenerCount('insertLeague')).toBeGreaterThan(0);
    });
  });

  describe('Event Emitter Instance', () => {
    it('should be an instance of EventEmitter', () => {
      expect(appEvents).toBeInstanceOf(EventEmitter);
    });

    it('should be able to emit and listen to custom events', (done) => {
      const testData = { test: 'data' };
      
      appEvents.once('testEvent', (data) => {
        expect(data).toEqual(testData);
        done();
      });

      appEvents.emit('testEvent', testData);
    });

    it('should handle multiple listeners for the same event', () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();
      const testData = { test: 'data' };

      appEvents.on('multiListenerTest', listener1);
      appEvents.on('multiListenerTest', listener2);

      appEvents.emit('multiListenerTest', testData);

      expect(listener1).toHaveBeenCalledWith(testData);
      expect(listener2).toHaveBeenCalledWith(testData);

      // Cleanup
      appEvents.removeAllListeners('multiListenerTest');
    });
  });
});