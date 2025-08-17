import { Match } from "../types/matchType";
import { MatchRepository } from "../repositories/match.repository";
import { getMatches } from "../integrations/footballApi";
import { appEvents } from "../events/eventEmitter";

const matchClient = new MatchRepository();

export async function insertMatch(match: Omit<Match, "_id">): Promise<Match> {
    return await matchClient.createMatch(match);
}

export async function getAllMatches(): Promise<Match[]> {
    return await matchClient.getAllMatches();
}

export async function getMatchById(id: string): Promise<Match | null> {
    return await matchClient.getMatchById(id);
}

export async function getMatchByLeague(leagueId: string): Promise<Match[] | null> {
    return await matchClient.getMatchByLeague(leagueId);
}

export async function updateMatch(id: string, match: Match): Promise<Match | null> {
    return await matchClient.updateMatch(id, match);
}

export async function deleteMatch(id: string): Promise<Match | null> {
    return await matchClient.deleteMatch(id);
}

export async function deleteAllMatches(): Promise<void> {
    return await matchClient.deleteAllMatches();
}


export async function syncMatches() {
    const matches = await getMatches();

    for (const match of matches) {
        const res = await matchClient.upsertMatch(match);

        if (res.upsertedCount > 0) {
            appEvents.emit("newMatch", match);
        }
    }
    return matches;
}