import * as teamService from '../../../src/services/team.service';
import { TeamRepository } from '../../../src/repositories/team.repository';
import * as footballApi from '../../../src/integrations/footballApi';
import { appEvents } from '../../../src/events/eventEmitter';
import { mockTeam } from '../../mocks';

// Mocks
jest.mock('../../../src/repositories/team.repository');
jest.mock('../../../src/integrations/footballApi');
jest.mock('../../../src/events/eventEmitter');

const MockedTeamRepository = TeamRepository as jest.MockedClass<typeof TeamRepository>;
const mockedFootballApi = footballApi as jest.Mocked<typeof footballApi>;
const mockedAppEvents = appEvents as jest.Mocked<typeof appEvents>;

describe('Team Service', () => {
    let teamRepo: jest.Mocked<TeamRepository>;

    beforeEach(() => {
        jest.clearAllMocks();
        teamRepo = new MockedTeamRepository() as jest.Mocked<TeamRepository>;
        (TeamRepository as any).mockImplementation(() => teamRepo);
    });

    describe('getAllTeams', () => {
        it('should return all teams', async () => {
            const expectedTeams = [mockTeam];
            teamRepo.getAllTeams.mockResolvedValue(expectedTeams as any);

            const result = await teamService.getAllTeams();

            expect(result).toEqual(expectedTeams);
            expect(teamRepo.getAllTeams).toHaveBeenCalledTimes(1);
        });
    });

    describe('getTeamById', () => {
        it('should return team by id', async () => {
            const teamId = '1';
            teamRepo.getTeamById.mockResolvedValue(mockTeam as any);

            const result = await teamService.getTeamById(teamId);

            expect(result).toEqual(mockTeam);
            expect(teamRepo.getTeamById).toHaveBeenCalledWith(teamId);
        });

        it('should return null when team not found', async () => {
            const teamId = '999';
            teamRepo.getTeamById.mockResolvedValue(null);

            const result = await teamService.getTeamById(teamId);

            expect(result).toBeNull();
            expect(teamRepo.getTeamById).toHaveBeenCalledWith(teamId);
        });
    });

    describe('insertTeam', () => {
        it('should create a new team', async () => {
            teamRepo.insertTeam.mockResolvedValue(mockTeam as any);

            const result = await teamService.insertTeam(mockTeam as any);

            expect(result).toEqual(mockTeam);
            expect(teamRepo.insertTeam).toHaveBeenCalledWith(mockTeam);
        });
    });

    describe('updateTeam', () => {
        it('should update a team', async () => {
            const teamId = '1';
            const updateData = { name: 'Updated Team Name' };
            const updatedTeam = { ...mockTeam, ...updateData };

            teamRepo.updateTeam.mockResolvedValue(updatedTeam as any);

            const result = await teamService.updateTeam(teamId, updateData as any);

            expect(result).toEqual(updatedTeam);
            expect(teamRepo.updateTeam).toHaveBeenCalledWith(teamId, updateData);
        });
    });

    describe('deleteTeam', () => {
        it('should delete a team', async () => {
            const teamId = '1';
            teamRepo.deleteTeam.mockResolvedValue(mockTeam as any);

            const result = await teamService.deleteTeam(teamId);

            expect(result).toEqual(mockTeam);
            expect(teamRepo.deleteTeam).toHaveBeenCalledWith(teamId);
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

            mockedFootballApi.getStanding.mockResolvedValue(apiResponse);
            teamRepo.upsertTeamStanding.mockResolvedValue({ modifiedCount: 1 } as any);

            const result = await teamService.syncTeams();

            expect(mockedFootballApi.getStanding).toHaveBeenCalledTimes(1);
            expect(teamRepo.upsertTeamStanding).toHaveBeenCalledTimes(1);
            expect(mockedAppEvents.emit).toHaveBeenCalledWith('updateTable', apiResponse.standings[0].table[0]);
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

            mockedFootballApi.getStanding.mockResolvedValue(apiResponse);
            teamRepo.upsertTeamStanding.mockResolvedValue({ modifiedCount: 0 } as any);

            await teamService.syncTeams();

            expect(mockedAppEvents.emit).not.toHaveBeenCalled();
        });
    });
});