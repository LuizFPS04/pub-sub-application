import axios from "axios";

const footballApi = axios.create({
  baseURL: "https://api.football-data.org/v4",
  headers: {
    "X-Auth-Token": process.env.FOOTBALL_API_KEY || "d2d4a170fe86468d997572f65aa3d557",
  },
});

export async function getCompetition() {
  const res = await footballApi.get(`/competitions/BSA`);
  return res.data;
}

export async function getMatches(params?: {
  dateFrom?: string;   // YYYY-MM-DD
  dateTo?: string;     // YYYY-MM-DD
  stage?: string;
  status?: "SCHEDULED" | "LIVE" | "IN_PLAY" | "PAUSED" | "FINISHED" | "POSTPONED" | "SUSPENDED" | "CANCELED";
  matchday?: number;
  group?: string;
  season?: number;
}) {
  const res = await footballApi.get(`/competitions/BSA/matches`, { params });
  return res.data.matches;
}

export async function getMatch(matchId: number) {
  const res = await footballApi.get(`/matches/${matchId}`);
  return res.data;
}

export async function getTeams() {
  const res = await footballApi.get(`/competitions/BSA/teams?season=2025`);
  return res.data;
}

export async function getStanding(season: number = 2025) {
  const res = await footballApi.get(`/competitions/BSA/standings?season=${season}`);
  return res.data;
}

export async function getTeam(teamId: number) {
  const res = await footballApi.get(`/teams/${teamId}`);
  return res.data;
}

export async function getPlayer(playerId: number) {
  const res = await footballApi.get(`/persons/${playerId}`);
  return res.data;
}

export async function getNormalizedStandings(season: number = 2025) {
  const data = await getStanding(season);

  const table = data.standings?.[0]?.table || [];
  return table.map((team: any) => ({
    position: team.position,
    name: team.team.name,
    crest: team.team.crest,
    points: team.points,
    playedGames: team.playedGames,
    won: team.won,
    draw: team.draw,
    lost: team.lost,
    goalsFor: team.goalsFor,
    goalsAgainst: team.goalsAgainst,
    goalDifference: team.goalDifference,
  }));
}

export async function getNormalizedMatches(params?: {
  dateFrom?: string;
  dateTo?: string;
  stage?: string;
  status?: "SCHEDULED" | "LIVE" | "IN_PLAY" | "PAUSED" | "FINISHED" | "POSTPONED" | "SUSPENDED" | "CANCELED";
  matchday?: number;
  group?: string;
  season?: number;
}) {
  const data = await getMatches(params);

  return data.matches.map((match: any) => ({
    id: match.id,
    date: match.utcDate,
    status: match.status,
    matchday: match.matchday,
    stage: match.stage,
    group: match.group,
    homeTeam: {
      id: match.homeTeam.id,
      name: match.homeTeam.name,
      crest: match.homeTeam.crest,
      score: match.score.fullTime.home ?? null,
    },
    awayTeam: {
      id: match.awayTeam.id,
      name: match.awayTeam.name,
      crest: match.awayTeam.crest,
      score: match.score.fullTime.away ?? null,
    },
  }));
}


export async function getNormalizedTeams() {
  const data = await getTeams();

  return data.teams.map((team: any) => ({
    id: team.id,
    name: team.name,
    tla: team.tla,
    crest: team.crest,
    venue: team.venue,
    founded: team.founded,
  }));
}