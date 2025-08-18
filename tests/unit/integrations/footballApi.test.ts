import axios from 'axios';
import * as footballApi from '../../../src/integrations/footballApi';
import { mockFootballApiResponse, mockMatchesApiResponse } from '../../mocks';

// Mock do axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock da instância do axios
const mockAxiosInstance = {
    get: jest.fn(),
};

describe('Football API Integration', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockedAxios.create.mockReturnValue(mockAxiosInstance as any);
    });

    describe('getCompetition', () => {
        it('should fetch competition data', async () => {
            const mockCompetitionData = {
                id: 2013,
                name: 'Campeonato Brasileiro Série A',
                country: 'Brazil'
            };

            mockAxiosInstance.get.mockResolvedValue({ data: mockCompetitionData });

            const result = await footballApi.getCompetition();

            expect(mockAxiosInstance.get).toHaveBeenCalledWith('/competitions/BSA');
            expect(result).toEqual(mockCompetitionData);
        });

        it('should handle API errors', async () => {
            const error = new Error('API Error');
            mockAxiosInstance.get.mockRejectedValue(error);

            await expect(footballApi.getCompetition()).rejects.toThrow('API Error');
        });
    });

    describe('getMatches', () => {
        it('should fetch matches without parameters', async () => {
            const mockResponse = { matches: mockMatchesApiResponse };
            mockAxiosInstance.get.mockResolvedValue({ data: mockResponse });

            const result = await footballApi.getMatches();

            expect(mockAxiosInstance.get).toHaveBeenCalledWith('/competitions/BSA/matches', { params: undefined });
            expect(result).toEqual(mockMatchesApiResponse);
        });

        it('should fetch matches with parameters', async () => {
            const params = {
                dateFrom: '2025-05-01',
                dateTo: '2025-05-31',
                status: 'FINISHED' as const,
                season: 2025
            };
            const mockResponse = { matches: mockMatchesApiResponse };
            mockAxiosInstance.get.mockResolvedValue({ data: mockResponse });

            const result = await footballApi.getMatches(params);

            expect(mockAxiosInstance.get).toHaveBeenCalledWith('/competitions/BSA/matches', { params });
            expect(result).toEqual(mockMatchesApiResponse);
        });
    });

    describe('getMatch', () => {
        it('should fetch single match by id', async () => {
            const matchId = 12345;
            const mockMatchData = mockMatchesApiResponse[0];
            mockAxiosInstance.get.mockResolvedValue({ data: mockMatchData });

            const result = await footballApi.getMatch(matchId);

            expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/matches/${matchId}`);
            expect(result).toEqual(mockMatchData);
        });
    });

    describe('getTeams', () => {
        it('should fetch teams', async () => {
            const mockTeamsData = mockFootballApiResponse;
            mockAxiosInstance.get.mockResolvedValue({ data: mockTeamsData });

            const result = await footballApi.getTeams();

            expect(mockAxiosInstance.get).toHaveBeenCalledWith('/competitions/BSA/teams?season=2025');
            expect(result).toEqual(mockTeamsData);
        });
    });

    describe('getStanding', () => {
        it('should fetch standings with default season', async () => {
            const mockStandingData = {
                standings: [{
                    table: [
                        {
                            position: 1,
                            team: { id: 1, name: 'Flamengo' },
                            points: 25
                        }
                    ]
                }]
            };
            mockAxiosInstance.get.mockResolvedValue({ data: mockStandingData });

            const result = await footballApi.getStanding();

            expect(mockAxiosInstance.get).toHaveBeenCalledWith('/competitions/BSA/standings?season=2025');
            expect(result).toEqual(mockStandingData);
        });

        it('should fetch standings with custom season', async () => {
            const season = 2024;
            const mockStandingData = { standings: [] };
            mockAxiosInstance.get.mockResolvedValue({ data: mockStandingData });

            const result = await footballApi.getStanding(season);

            expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/competitions/BSA/standings?season=${season}`);
            expect(result).toEqual(mockStandingData);
        });
    });

    describe('getNormalizedStandings', () => {
        it('should normalize standings data', async () => {
            const mockStandingData = {
                standings: [{
                    table: [
                        {
                            position: 1,
                            team: {
                                name: 'Flamengo',
                                crest: 'https://example.com/crest.png'
                            },
                            points: 25,
                            playedGames: 10,
                            won: 8,
                            draw: 1,
                            lost: 1,
                            goalsFor: 20,
                            goalsAgainst: 5,
                            goalDifference: 15
                        }
                    ]
                }]
            };
            mockAxiosInstance.get.mockResolvedValue({ data: mockStandingData });

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
            const mockStandingData = { standings: [] };
            mockAxiosInstance.get.mockResolvedValue({ data: mockStandingData });

            const result = await footballApi.getNormalizedStandings();

            expect(result).toEqual([]);
        });
    });

    describe('getNormalizedTeams', () => {
        it('should normalize teams data', async () => {
            const mockTeamsData = {
                teams: [
                    {
                        id: 1,
                        name: 'Flamengo',
                        tla: 'FLA',
                        crest: 'https://example.com/crest.png',
                        venue: 'Maracanã',
                        founded: 1895
                    }
                ]
            };
            mockAxiosInstance.get.mockResolvedValue({ data: mockTeamsData });

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

    describe('API Configuration', () => {
        it('should create axios instance with correct config', () => {
            expect(mockedAxios.create).toHaveBeenCalledWith({
                baseURL: "https://api.football-data.org/v4",
                headers: {
                    "X-Auth-Token": expect.any(String),
                },
            });
        });
    });
});