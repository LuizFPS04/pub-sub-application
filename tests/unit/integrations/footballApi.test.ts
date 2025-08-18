import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockAxiosInstance = {
    get: jest.fn(),
};

mockedAxios.create.mockReturnValue(mockAxiosInstance as any);

import * as footballApi from '../../../src/integrations/footballApi';
import { mockFootballApiResponse, mockMatchesApiResponse } from '../../mocks';

beforeEach(() => {
    jest.clearAllMocks();
    mockedAxios.create.mockReturnValue(mockAxiosInstance as any);
});

describe('Football API Integration', () => {
    describe('getCompetition', () => {
        it('should fetch competition data', async () => {
            const mockData = { id: 2013, name: 'Campeonato Brasileiro Série A', country: 'Brazil' };
            mockAxiosInstance.get.mockResolvedValue({ data: mockData });

            const result = await footballApi.getCompetition();

            expect(mockAxiosInstance.get).toHaveBeenCalledWith('/competitions/BSA');
            expect(result).toEqual(mockData);
        });

        it('should handle API errors', async () => {
            const error = new Error('API Error');
            mockAxiosInstance.get.mockRejectedValue(error);

            await expect(footballApi.getCompetition()).rejects.toThrow('API Error');
        });
    });

    describe('getMatches', () => {
        it('should fetch matches without params', async () => {
            const mockData = { matches: mockMatchesApiResponse };
            mockAxiosInstance.get.mockResolvedValue({ data: mockData });

            const result = await footballApi.getMatches();

            expect(mockAxiosInstance.get).toHaveBeenCalledWith('/competitions/BSA/matches', { params: undefined });
            expect(result).toEqual(mockMatchesApiResponse);
        });

        it('should fetch matches with params', async () => {
            const params = { dateFrom: '2025-05-01', dateTo: '2025-05-31', status: 'FINISHED' as const, season: 2025 };
            const mockData = { matches: mockMatchesApiResponse };
            mockAxiosInstance.get.mockResolvedValue({ data: mockData });

            const result = await footballApi.getMatches(params);

            expect(mockAxiosInstance.get).toHaveBeenCalledWith('/competitions/BSA/matches', { params });
            expect(result).toEqual(mockMatchesApiResponse);
        });
    });

    describe('getMatch', () => {
        it('should fetch single match by id', async () => {
            const matchId = 12345;
            const mockData = mockMatchesApiResponse[0];
            mockAxiosInstance.get.mockResolvedValue({ data: mockData });

            const result = await footballApi.getMatch(matchId);

            expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/matches/${matchId}`);
            expect(result).toEqual(mockData);
        });
    });

    describe('getTeams', () => {
        it('should fetch teams', async () => {
            const mockData = mockFootballApiResponse;
            mockAxiosInstance.get.mockResolvedValue({ data: mockData });

            const result = await footballApi.getTeams();

            expect(mockAxiosInstance.get).toHaveBeenCalledWith('/competitions/BSA/teams?season=2025');
            expect(result).toEqual(mockData);
        });
    });

    describe('getStanding', () => {
        it('should fetch standings with default season', async () => {
            const mockData = { standings: [{ table: [{ position: 1, team: { id: 1, name: 'Flamengo' }, points: 25 }] }] };
            mockAxiosInstance.get.mockResolvedValue({ data: mockData });

            const result = await footballApi.getStanding();

            expect(mockAxiosInstance.get).toHaveBeenCalledWith('/competitions/BSA/standings?season=2025');
            expect(result).toEqual(mockData);
        });

        it('should fetch standings with custom season', async () => {
            const season = 2024;
            const mockData = { standings: [] };
            mockAxiosInstance.get.mockResolvedValue({ data: mockData });

            const result = await footballApi.getStanding(season);

            expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/competitions/BSA/standings?season=${season}`);
            expect(result).toEqual(mockData);
        });
    });

    describe('getNormalizedStandings', () => {
        it('should normalize standings', async () => {
            const mockData = {
                standings: [{
                    table: [{
                        position: 1,
                        team: { name: 'Flamengo', crest: 'https://example.com/crest.png' },
                        points: 25,
                        playedGames: 10,
                        won: 8,
                        draw: 1,
                        lost: 1,
                        goalsFor: 20,
                        goalsAgainst: 5,
                        goalDifference: 15
                    }]
                }]
            };
            mockAxiosInstance.get.mockResolvedValue({ data: mockData });

            const result = await footballApi.getNormalizedStandings();

            expect(result).toEqual([{
                position: 1,
                name: 'Flamengo',
                crest: 'https://example.com/crest.png',
                points: 25,
                playedGames: 10,
                won: 8,
                draw: 1,
                lost: 1,
                goalsFor: 20,
                goalsAgainst: 5,
                goalDifference: 15
            }]);
        });

        it('should handle empty standings', async () => {
            const mockData = { standings: [] };
            mockAxiosInstance.get.mockResolvedValue({ data: mockData });

            const result = await footballApi.getNormalizedStandings();
            expect(result).toEqual([]);
        });
    });

    describe('getNormalizedTeams', () => {
        it('should normalize teams', async () => {
            const mockData = { teams: [{ id: 1, name: 'Flamengo', tla: 'FLA', crest: 'https://example.com/crest.png', venue: 'Maracanã', founded: 1895 }] };
            mockAxiosInstance.get.mockResolvedValue({ data: mockData });

            const result = await footballApi.getNormalizedTeams();
            expect(result).toEqual([{
                id: 1,
                name: 'Flamengo',
                tla: 'FLA',
                crest: 'https://example.com/crest.png',
                venue: 'Maracanã',
                founded: 1895
            }]);
        });
    });
});