// IMPORTANTE: Mocks DEVEM vir antes de qualquer import
const mockMatchRepository = {
    getAllMatches: jest.fn(),
    getMatchById: jest.fn(),
    createMatch: jest.fn(),
    updateMatch: jest.fn(),
    deleteMatch: jest.fn(),
    upsertMatch: jest.fn(),
};

const mockFootballApi = {
    getMatches: jest.fn(),
    getStanding: jest.fn(),
};

const mockAppEvents = {
    emit: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
};

// Mock dos módulos
jest.mock('../../../src/repositories/match.repository', () => ({
    MatchRepository: jest.fn(() => mockMatchRepository)
}));

jest.mock('../../../src/integrations/footballApi', () => mockFootballApi);

jest.mock('../../../src/events/eventEmitter', () => ({
    appEvents: mockAppEvents
}));

// Agora importa o service (DEPOIS dos mocks)
import * as matchService from '../../../src/services/match.service';
import { mockMatch, mockMatchesApiResponse } from '../../mocks';

describe('Match Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllMatches', () => {
        it('should return all matches', async () => {
            const expectedMatches = [mockMatch];
            mockMatchRepository.getAllMatches.mockResolvedValue(expectedMatches);

            const result = await matchService.getAllMatches();

            expect(result).toEqual(expectedMatches);
            expect(mockMatchRepository.getAllMatches).toHaveBeenCalledTimes(1);
        });
    });

    describe('getMatchById', () => {
        it('should return match by id', async () => {
            const matchId = '12345';
            mockMatchRepository.getMatchById.mockResolvedValue(mockMatch);

            const result = await matchService.getMatchById(matchId);

            expect(result).toEqual(mockMatch);
            expect(mockMatchRepository.getMatchById).toHaveBeenCalledWith(matchId);
        });

        it('should return null when match not found', async () => {
            const matchId = '999';
            mockMatchRepository.getMatchById.mockResolvedValue(null);

            const result = await matchService.getMatchById(matchId);

            expect(result).toBeNull();
            expect(mockMatchRepository.getMatchById).toHaveBeenCalledWith(matchId);
        });
    });

    describe('insertMatch', () => {
        it('should create a new match', async () => {
            mockMatchRepository.createMatch.mockResolvedValue(mockMatch);

            const result = await matchService.insertMatch(mockMatch as any);

            expect(result).toEqual(mockMatch);
            expect(mockMatchRepository.createMatch).toHaveBeenCalledWith(mockMatch);
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

            mockMatchRepository.getMatchById.mockResolvedValue(existingMatch);
            mockMatchRepository.updateMatch.mockResolvedValue(updatedMatch);

            const result = await matchService.updateMatch(matchId, updatedMatch as any);

            expect(result).toEqual(updatedMatch);
            expect(mockMatchRepository.getMatchById).toHaveBeenCalledWith(matchId);
            expect(mockMatchRepository.updateMatch).toHaveBeenCalledWith(matchId, updatedMatch);
            expect(mockAppEvents.emit).toHaveBeenCalledWith('matchUpdated', {
                match: updatedMatch,
                changedFields: ['score']
            });
        });

        it('should return null when match not found', async () => {
            const matchId = '999';
            mockMatchRepository.getMatchById.mockResolvedValue(null);

            const result = await matchService.updateMatch(matchId, mockMatch as any);

            expect(result).toBeNull();
            expect(mockMatchRepository.getMatchById).toHaveBeenCalledWith(matchId);
            expect(mockMatchRepository.updateMatch).not.toHaveBeenCalled();
            expect(mockAppEvents.emit).not.toHaveBeenCalled();
        });

        it('should not emit event when no fields change', async () => {
            const matchId = '12345';
            const existingMatch = mockMatch;
            const updatedMatch = { ...mockMatch };

            mockMatchRepository.getMatchById.mockResolvedValue(existingMatch);
            mockMatchRepository.updateMatch.mockResolvedValue(updatedMatch);

            await matchService.updateMatch(matchId, updatedMatch as any);

            expect(mockAppEvents.emit).not.toHaveBeenCalled();
        });
    });

    describe('syncMatches', () => {
        it('should sync new matches and emit events', async () => {
            const today = new Date();
            const todayStr = today.toISOString().split("T")[0];

            mockFootballApi.getMatches.mockResolvedValue(mockMatchesApiResponse);
            mockMatchRepository.getMatchById.mockResolvedValue(null);
            mockMatchRepository.upsertMatch.mockResolvedValue({ upsertedCount: 1 });

            const result = await matchService.syncMatches();

            expect(mockFootballApi.getMatches).toHaveBeenCalledWith({
                dateFrom: todayStr,
                dateTo: todayStr,
                season: 2025,
            });
            expect(mockMatchRepository.getMatchById).toHaveBeenCalledWith(mockMatchesApiResponse[0].id);
            expect(mockMatchRepository.upsertMatch).toHaveBeenCalledWith(mockMatchesApiResponse[0]);
            expect(mockAppEvents.emit).toHaveBeenCalledWith('newMatch', mockMatchesApiResponse[0]);
            expect(result).toEqual(mockMatchesApiResponse);
        });

        it('should update existing matches', async () => {
            const existingMatch = { ...mockMatch, id: '12345' };

            mockFootballApi.getMatches.mockResolvedValue(mockMatchesApiResponse);
            mockMatchRepository.getMatchById.mockResolvedValue(existingMatch);
            mockMatchRepository.updateMatch.mockResolvedValue(existingMatch);

            await matchService.syncMatches();

            expect(mockMatchRepository.getMatchById).toHaveBeenCalledWith(mockMatchesApiResponse[0].id);
            // Verifica se updateMatch foi chamado em vez de upsertMatch
            expect(mockMatchRepository.updateMatch).toHaveBeenCalled();
            expect(mockMatchRepository.upsertMatch).not.toHaveBeenCalled();
        });
    });
});