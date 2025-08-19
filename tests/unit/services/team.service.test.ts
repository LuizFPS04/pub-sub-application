const mockTeamRepository = {
    getAllTeams: jest.fn(),
    getTeamById: jest.fn(),
    insertTeam: jest.fn(),
    updateTeam: jest.fn(),
    deleteTeam: jest.fn(),
    upsertTeamStanding: jest.fn(),
};

const mockFootballApi = {
    getStanding: jest.fn(),
    getMatches: jest.fn(),
};

const mockAppEvents = {
    emit: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
};

// Mock dos módulos
jest.mock('../../../src/repositories/team.repository', () => ({
    TeamRepository: jest.fn(() => mockTeamRepository)
}));

jest.mock('../../../src/integrations/footballApi', () => mockFootballApi);

jest.mock('../../../src/events/eventEmitter', () => ({
    appEvents: mockAppEvents
}));

// Agora importa o service (DEPOIS dos mocks)
import * as teamService from '../../../src/services/team.service';
import { mockTeam } from '../../mocks';

describe('Team Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllTeams', () => {
        it('should return all teams', async () => {
            const expectedTeams = [mockTeam];
            mockTeamRepository.getAllTeams.mockResolvedValue(expectedTeams);

            const result = await teamService.getAllTeams();

            expect(result).toEqual(expectedTeams);
            expect(mockTeamRepository.getAllTeams).toHaveBeenCalledTimes(1);
        });
    });

    describe('getTeamById', () => {
        it('should return team by id', async () => {
            const teamId = '1';
            mockTeamRepository.getTeamById.mockResolvedValue(mockTeam);

            const result = await teamService.getTeamById(teamId);

            expect(result).toEqual(mockTeam);
            expect(mockTeamRepository.getTeamById).toHaveBeenCalledWith(teamId);
        });

        it('should return null when team not found', async () => {
            const teamId = '999';
            mockTeamRepository.getTeamById.mockResolvedValue(null);

            const result = await teamService.getTeamById(teamId);

            expect(result).toBeNull();
            expect(mockTeamRepository.getTeamById).toHaveBeenCalledWith(teamId);
        });
    });

    describe('insertTeam', () => {
        it('should create a new team', async () => {
            mockTeamRepository.insertTeam.mockResolvedValue(mockTeam);

            const result = await teamService.insertTeam(mockTeam as any);

            expect(result).toEqual(mockTeam);
            expect(mockTeamRepository.insertTeam).toHaveBeenCalledWith(mockTeam);
        });
    });

    describe('updateTeam', () => {
        it('should update a team', async () => {
            const teamId = '1';
            const updateData = { name: 'Updated Team Name' };
            const updatedTeam = { ...mockTeam, ...updateData };

            mockTeamRepository.updateTeam.mockResolvedValue(updatedTeam);

            const result = await teamService.updateTeam(teamId, updateData as any);

            expect(result).toEqual(updatedTeam);
            expect(mockTeamRepository.updateTeam).toHaveBeenCalledWith(teamId, updateData);
        });
    });

    describe('deleteTeam', () => {
        it('should delete a team', async () => {
            const teamId = '1';
            mockTeamRepository.deleteTeam.mockResolvedValue(mockTeam);

            const result = await teamService.deleteTeam(teamId);

            expect(result).toEqual(mockTeam);
            expect(mockTeamRepository.deleteTeam).toHaveBeenCalledWith(teamId);
        });
    });

    describe('syncTeams', () => {
        it('should sync teams from API and emit events', async () => {
            const apiResponse = {
                standings: [{
                    table: [
                        {
                            team: { id: 1 },
                            position: 1,
                            points: 25,
                            // outros dados...
                        }
                    ]
                }]
            };

            mockFootballApi.getStanding.mockResolvedValue(apiResponse);
            mockTeamRepository.upsertTeamStanding.mockResolvedValue({ modifiedCount: 1 });

            const result = await teamService.syncTeams();

            expect(mockFootballApi.getStanding).toHaveBeenCalledTimes(1);
            expect(mockTeamRepository.upsertTeamStanding).toHaveBeenCalledTimes(1);
            expect(mockAppEvents.emit).toHaveBeenCalledWith('updateTable', apiResponse.standings[0].table[0]);
            expect(result).toEqual(apiResponse);
        });

        it('should not emit event when team is not modified', async () => {
            const apiResponse = {
                standings: [{
                    table: [
                        {
                            team: { id: 1 },
                            position: 1,
                            points: 25,
                        }
                    ]
                }]
            };

            mockFootballApi.getStanding.mockResolvedValue(apiResponse);
            mockTeamRepository.upsertTeamStanding.mockResolvedValue({ modifiedCount: 0 });

            await teamService.syncTeams();

            expect(mockAppEvents.emit).not.toHaveBeenCalled();
        });
    });
});