import { League } from "../types/leagueType";
import { LeagueRepository } from "../repositories/league.repository";
import { getTeams } from "../integrations/footballApi";
import { appEvents } from "../events/eventEmitter";
import { TeamRepository } from "../repositories/team.repository";
const teamRepo = new TeamRepository();

const leagueClient = new LeagueRepository(teamRepo);

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

export async function createLeague(league: Omit<League, "_id">): Promise<League> {
    return await leagueClient.createLeague(league);
}

export async function syncLeague() {
    const teams = await getTeams();

    const res = await leagueClient.upsertLeague(teams);

    if (res.upsertedCount > 0) {
        appEvents.emit("insertLeague", teams);
    }
    return teams;
}