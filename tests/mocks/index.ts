import { Types } from 'mongoose';

// Mock de usuário
export const mockUser = {
    name: 'João Silva',
    email: 'joao@email.com',
    password: 'senha123',
    followedTeams: [new Types.ObjectId()]
};

// Mock de time
export const mockTeam = {
    _id: new Types.ObjectId(),
    id: 1,
    name: 'Flamengo',
    shortName: 'Flamengo',
    tla: 'FLA',
    crest: 'https://example.com/crest.png',
    website: 'https://flamengo.com',
    clubColors: 'Red / Black',
    stadium: 'Maracanã',
    position: 1,
    playedGames: 10,
    won: 8,
    draw: 1,
    lost: 1,
    points: 25,
    goalsFor: 20,
    goalsAgainst: 5,
    goalDifference: 15
};

// Mock de liga
export const mockLeague = {
    _id: new Types.ObjectId(),
    name: 'Campeonato Brasileiro',
    country: 'Brasil',
    season: '2025',
    teams: [],
    leagueId: 2013
};

// Mock de partida
export const mockMatch = {
    _id: new Types.ObjectId(),
    id: '12345',
    matchName: 'Campeonato Brasileiro 2025 - Rodada 1 - Flamengo × Vasco',
    homeTeam: {
        id: 1,
        name: 'Flamengo',
        shortName: 'Flamengo',
        tla: 'FLA',
        crest: 'https://example.com/crest.png'
    },
    awayTeam: {
        id: 2,
        name: 'Vasco',
        shortName: 'Vasco',
        tla: 'VAS',
        crest: 'https://example.com/vasco.png'
    },
    date: new Date('2025-05-01T20:00:00Z'),
    score: {
        home: 2,
        away: 1
    },
    status: 'FINISHED',
    leagueId: new Types.ObjectId(),
    events: [],
    referee: 'Árbitro Teste',
    stadium: 'Maracanã'
};

// Mock de notificação
export const mockNotification = {
    _id: new Types.ObjectId(),
    userId: new Types.ObjectId(),
    type: 'newMatch',
    message: '📢 Novo jogo: Flamengo × Vasco',
    teams: ['Flamengo', 'Vasco'],
    matchId: new Types.ObjectId()
};

// Mock da API de futebol
export const mockFootballApiResponse = {
    competition: {
        id: 2013,
        name: 'Campeonato Brasileiro'
    },
    filters: {
        season: '2025'
    },
    teams: [mockTeam]
};

export const mockMatchesApiResponse = [
    {
        id: 12345,
        utcDate: '2025-05-01T20:00:00Z',
        status: 'FINISHED',
        matchday: 1,
        stage: 'REGULAR_SEASON',
        group: null,
        homeTeam: {
            id: 1,
            name: 'Flamengo',
            crest: 'https://example.com/crest.png'
        },
        awayTeam: {
            id: 2,
            name: 'Vasco',
            crest: 'https://example.com/vasco.png'
        },
        score: {
            fullTime: {
                home: 2,
                away: 1
            }
        },
        competition: {
            name: 'Campeonato Brasileiro'
        },
        season: {
            currentMatchday: 1
        }
    }
];