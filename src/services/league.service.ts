import { League } from "../types/leagueType";
import { LeagueRepository } from "../repositories/league.repository";

const leagueClient = new LeagueRepository();

export async function getAllLeagues(): Promise<League[]> {
    return await leagueClient.getAllLeagues();
}

export async function getLeagueById(id: string): Promise<League | null> {
    return await leagueClient.getLeagueById(id);
}

export async function deleteAllLeagues(): Promise<void> {
    return await leagueClient.deleteAllLeagues();
}

export async function deleteLeague(id: string) {
    return await leagueClient.deleteLeague(id);
}

export async function updateLeague(id: string, league: League): Promise<League | null> {
    return await leagueClient.updateLeague(id, league);
}

export async function createLeague(league:  Omit<League, "_id">): Promise<League> {
    return await leagueClient.createLeague(league);
}