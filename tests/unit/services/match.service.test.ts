import * as matchService from '../../../src/services/match.service';
import { MatchRepository } from '../../../src/repositories/match.repository';
import * as footballApi from '../../../src/integrations/footballApi';
import { appEvents } from '../../../src/events/eventEmitter';
import { mockMatch, mockMatchesApiResponse } from '../../mocks';

// Mocks
jest.mock('../../../src/repositories/match.repository');
jest.mock('../../../src/integrations/footballApi');
jest.mock('../../../src/events/eventEmitter');

const MockedMatchRepository = MatchRepository as jest.MockedClass<typeof MatchRepository>;
const mockedFootballApi = footballApi as jest.Mocked<typeof footballApi>;
const mockedAppEvents = appEvents as jest.Mocked<typeof appEvents>;

describe('Match Service', () => {
    let matchRepo: jest.Mocked<MatchRepository>;

    beforeEach(() => {
        jest.clearAllMocks();
        matchRepo = new MockedMatchRepository() as jest.Mocked<MatchRepository>;
        (MatchRepository as any).mockImplementation(() => matchRepo);
    });

    describe('getAllMatches', () => {
        it('should return all matches', async () => {
            const expectedMatches = [mockMatch];
            matchRepo.getAllMatches.mockResolvedValue(expectedMatches as any);

            const result = await matchService.getAllMatches();

            expect(result).toEqual(expectedMatches);
            expect(matchRepo.getAllMatches).toHaveBeenCalledTimes(1);
        });
    });

    describe('getMatchById', () => {
        it('should return match by id', async () => {
            const matchId = '12345';
            matchRepo.getMatchById.mockResolvedValue(mockMatch as any);

            const result = await matchService.getMatchById(matchId);

            expect(result).toEqual(mockMatch);
            expect(matchRepo.getMatchById).toHaveBeenCalledWith(matchId);
        });

        it('should return null when match not found', async () => {
            const matchId = '999';
            matchRepo.getMatchById.mockResolvedValue(null);

            const result = await matchService.getMatchById(matchId);

            expect(result).toBeNull();
            expect(matchRepo.getMatchById).toHaveBeenCalledWith(matchId);
        });
    });

    describe('insertMatch', () => {
        it('should create a new match', async () => {
            matchRepo.createMatch.mockResolvedValue(mockMatch as any);

            const result = await matchService.insertMatch(mockMatch as any);

            expect(result).toEqual(mockMatch);
            expect(matchRepo.createMatch).toHaveBeenCalledWith(mockMatch);
        });
    });

    describe('updateMatch', () => {
        it('should update match and emit event when fields change', async () => {
            const matchId = '12345';
            const existingMatch = mockMatch;
            const updatedMatch = {
                ...mockMatch,
                status: 'FINISHED' as const,
                score: { home: 3, away: 1 }
            };

            matchRepo.getMatchById.mockResolvedValue(existingMatch as any);
            matchRepo.updateMatch.mockResolvedValue(updatedMatch as any);

            const result = await matchService.updateMatch(matchId, updatedMatch as any);

            expect(result).toEqual(updatedMatch);
            expect(matchRepo.getMatchById).toHaveBeenCalledWith(matchId);
            expect(matchRepo.updateMatch).toHaveBeenCalledWith(matchId, updatedMatch);
            expect(mockedAppEvents.emit).toHaveBeenCalledWith('matchUpdated', {
                match: updatedMatch,
                changedFields: ['score']
            });
        });

        it('should return null when match not found', async () => {
            const matchId = '999';
            matchRepo.getMatchById.mockResolvedValue(null);

            const result = await matchService.updateMatch(matchId, mockMatch as any);

            expect(result).toBeNull();
            expect(matchRepo.getMatchById).toHaveBeenCalledWith(matchId);
            expect(matchRepo.updateMatch).not.toHaveBeenCalled();
            expect(mockedAppEvents.emit).not.toHaveBeenCalled();
        });

        it('should not emit event when no fields change', async () => {
            const matchId = '12345';
            const existingMatch = mockMatch;
            const updatedMatch = { ...mockMatch };

            matchRepo.getMatchById.mockResolvedValue(existingMatch as any);
            matchRepo.updateMatch.mockResolvedValue(updatedMatch as any);

            await matchService.updateMatch(matchId, updatedMatch as any);

            expect(mockedAppEvents.emit).not.toHaveBeenCalled();
        });
    });

    describe('syncMatches', () => {
        it('should sync new matches and emit events', async () => {
            const today = new Date();
            const todayStr = today.toISOString().split("T")[0];

            mockedFootballApi.getMatches.mockResolvedValue(mockMatchesApiResponse);
            matchRepo.getMatchById.mockResolvedValue(null);
            matchRepo.upsertMatch.mockResolvedValue({ upsertedCount: 1 } as any);

            const result = await matchService.syncMatches();

            expect(mockedFootballApi.getMatches).toHaveBeenCalledWith({
                dateFrom: todayStr,
                dateTo: todayStr,
                season: 2025,
            });
            expect(matchRepo.getMatchById).toHaveBeenCalledWith(mockMatchesApiResponse[0].id);
            expect(matchRepo.upsertMatch).toHaveBeenCalledWith(mockMatchesApiResponse[0]);
            expect(mockedAppEvents.emit).toHaveBeenCalledWith('newMatch', mockMatchesApiResponse[0]);
            expect(result).toEqual(mockMatchesApiResponse);
        });

        it('should update existing matches', async () => {
            const existingMatch = { ...mockMatch, id: '12345' };

            mockedFootballApi.getMatches.mockResolvedValue(mockMatchesApiResponse);
            matchRepo.getMatchById.mockResolvedValue(existingMatch as any);
            matchRepo.updateMatch.mockResolvedValue(existingMatch as any);

            await matchService.syncMatches();

            expect(matchRepo.getMatchById).toHaveBeenCalledWith(mockMatchesApiResponse[0].id);
            // Verifica se updateMatch foi chamado em vez de upsertMatch
            expect(matchRepo.updateMatch).toHaveBeenCalled();
            expect(matchRepo.upsertMatch).not.toHaveBeenCalled();
        });
    });
});