import { Request, Response } from 'express';
import * as matchController from '../../../src/controllers/match.controller';
import * as matchService from '../../../src/services/match.service';
import { mockMatch } from '../../mocks';

jest.mock('../../../src/services/match.service');
const mockedMatchService = matchService as jest.Mocked<typeof matchService>;

const mockRequest = (body?: any, params?: any, query?: any): Partial<Request> => ({
    body,
    params,
    query,
});

const mockResponse = (): Partial<Response> => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('Match Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('insertMatch', () => {
        it('should create match successfully', async () => {
            const matchData = {
                homeTeam: mockMatch.homeTeam,
                awayTeam: mockMatch.awayTeam,
                date: mockMatch.date,
                score: mockMatch.score,
                status: mockMatch.status,
                leagueId: mockMatch.leagueId,
                events: mockMatch.events,
                referee: mockMatch.referee,
                stadium: mockMatch.stadium
            };

            const req = mockRequest(matchData);
            const res = mockResponse();

            mockedMatchService.insertMatch.mockResolvedValue(mockMatch as any);

            await matchController.insertMatch(req as Request, res as Response);

            expect(mockedMatchService.insertMatch).toHaveBeenCalledWith(matchData);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.send).toHaveBeenCalledWith({
                success: true,
                message: 'Mathc created successfully',
                data: mockMatch,
            });
        });

        it('should handle service returning null', async () => {
            const req = mockRequest(mockMatch);
            const res = mockResponse();

            mockedMatchService.insertMatch.mockResolvedValue(null as any);

            await matchController.insertMatch(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({
                success: false,
                message: 'Failed to create match',
            });
        });

        it('should handle service errors', async () => {
            const req = mockRequest(mockMatch);
            const res = mockResponse();

            const error = new Error('Database error');
            mockedMatchService.insertMatch.mockRejectedValue(error);

            await matchController.insertMatch(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith({
                success: false,
                message: 'Database error',
            });
        });
    });

    describe('updateMatch', () => {
        it('should update match successfully', async () => {
            const matchId = '12345';
            const updateData = { status: 'FINISHED' };
            const updatedMatch = { ...mockMatch, status: 'FINISHED' };

            const req = mockRequest(updateData, { id: matchId });
            const res = mockResponse();

            mockedMatchService.updateMatch.mockResolvedValue(updatedMatch as any);

            await matchController.updateMatch(req as Request, res as Response);

            expect(mockedMatchService.updateMatch).toHaveBeenCalledWith(matchId, updateData);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({
                success: true,
                message: 'Match updated successfully',
                data: updatedMatch,
            });
        });

        it('should handle match not found', async () => {
            const matchId = '999';
            const req = mockRequest({}, { id: matchId });
            const res = mockResponse();

            mockedMatchService.updateMatch.mockResolvedValue(null);

            await matchController.updateMatch(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith({
                success: false,
                message: 'Match not found',
            });
        });
    });

    describe('getAllMatches', () => {
        it('should return all matches', async () => {
            const req = mockRequest();
            const res = mockResponse();
            const matches = [mockMatch];

            mockedMatchService.getAllMatches.mockResolvedValue(matches as any);

            await matchController.getAllMatches(req as Request, res as Response);

            expect(mockedMatchService.getAllMatches).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({
                success: true,
                message: 'Matches fetched successfully',
                data: matches,
            });
        });

        it('should handle no matches found', async () => {
            const req = mockRequest();
            const res = mockResponse();

            mockedMatchService.getAllMatches.mockResolvedValue(null as any);

            await matchController.getAllMatches(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith({
                success: false,
                message: 'No matches found',
            });
        });
    });

    describe('getMatchById', () => {
        it('should return match by id', async () => {
            const matchId = '12345';
            const req = mockRequest(undefined, undefined, { id: matchId });
            const res = mockResponse();

            mockedMatchService.getMatchById.mockResolvedValue(mockMatch as any);

            await matchController.getMatchById(req as Request, res as Response);

            expect(mockedMatchService.getMatchById).toHaveBeenCalledWith(matchId);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({
                success: true,
                message: 'Match fetched successfully',
                data: mockMatch,
            });
        });

        it('should handle match not found', async () => {
            const matchId = '999';
            const req = mockRequest(undefined, undefined, { id: matchId });
            const res = mockResponse();

            mockedMatchService.getMatchById.mockResolvedValue(null);

            await matchController.getMatchById(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith({
                success: false,
                message: 'No match found',
            });
        });
    });

    describe('getMatchByLeague', () => {
        it('should return matches by league', async () => {
            const leagueId = 'league123';
            const req = mockRequest(undefined, undefined, { leagueId });
            const res = mockResponse();
            const matches = [mockMatch];

            mockedMatchService.getMatchByLeague.mockResolvedValue(matches as any);

            await matchController.getMatchByLeague(req as Request, res as Response);

            expect(mockedMatchService.getMatchByLeague).toHaveBeenCalledWith(leagueId);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({
                success: true,
                message: 'Match fetched successfully',
                data: matches,
            });
        });

        it('should handle no matches found for league', async () => {
            const leagueId = 'league999';
            const req = mockRequest(undefined, undefined, { leagueId });
            const res = mockResponse();

            mockedMatchService.getMatchByLeague.mockResolvedValue(null);

            await matchController.getMatchByLeague(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith({
                success: false,
                message: 'No match found',
            });
        });
    });

    describe('syncNow', () => {
        it('should sync matches and return success', async () => {
            const req = mockRequest();
            const res = mockResponse();
            const matches = [mockMatch];

            mockedMatchService.syncMatches.mockResolvedValue(matches as any);

            await matchController.syncNow(req as Request, res as Response);

            expect(mockedMatchService.syncMatches).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                total: matches.length
            });
        });

        it('should handle sync errors', async () => {
            const req = mockRequest();
            const res = mockResponse();

            const error = new Error('Sync failed');
            mockedMatchService.syncMatches.mockRejectedValue(error);

            await expect(matchController.syncNow(req as Request, res as Response))
                .rejects.toThrow('Sync failed');
        });
    });
});