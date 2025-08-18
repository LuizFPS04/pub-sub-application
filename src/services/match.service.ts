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

export async function updateMatch(id: string, updatedMatch: Match): Promise<Match | null> {
    const existingMatch = await matchClient.getMatchById(id);
    if (!existingMatch) return null;

    const changedFields: string[] = [];

    if (updatedMatch.status !== existingMatch.status) {
        changedFields.push("status");
    }

    if (
        updatedMatch.score &&
        existingMatch.score &&
        (updatedMatch.score.home !== existingMatch.score.home ||
         updatedMatch.score.away !== existingMatch.score.away)
    ) {
        changedFields.push("score");
    }

    const match = await matchClient.updateMatch(id, updatedMatch);

    if (changedFields.length > 0) {
        appEvents.emit("matchUpdated", { match, changedFields });
    }

    return match;
}

export async function deleteMatch(id: string): Promise<Match | null> {
    return await matchClient.deleteMatch(id);
}

export async function deleteAllMatches(): Promise<void> {
    return await matchClient.deleteAllMatches();
}


export async function syncMatches() {
    const today = new Date();
    const matches = await getMatches(
        {
            dateFrom: today.toISOString().split("T")[0],
            dateTo: today.toISOString().split("T")[0],
            season: 2025,
        }
    );

    for (const match of matches) {

        const existingMatch = await matchClient.getMatchById(match.id)

        if (existingMatch) {
            await updateMatch(existingMatch.id, match.score.fullTime);
        } else {
            const res = await matchClient.upsertMatch(match);
            if (res.upsertedCount > 0) {
                appEvents.emit("newMatch", match);
            }
        }
    }
    return matches;
}