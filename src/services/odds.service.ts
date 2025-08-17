import { Odds } from "../types/oddsType";
import { OddsRepository } from "../repositories/odds.repository";
import { Types } from "mongoose";

const oddsClient = new OddsRepository();

export async function insertOdd(odds:  Omit<Odds, "_id">): Promise<Odds> {
    return await oddsClient.insertOdd(odds);
}

export async function getAllOdds(): Promise<Odds[]> {
    return await oddsClient.getAllOdds();
}

export async function getOddById(id: string | Types.ObjectId): Promise<Odds | null> {
    return oddsClient.getOddById(id);
}

export async function updateOdd(id: string | Types.ObjectId, odds: Odds): Promise<Odds | null> {
    return await oddsClient.updateOdd(id, odds);
}

export async function deleteOdd(id: string | Types.ObjectId): Promise <Odds | null> {
    return await oddsClient.deleteOdd(id);
}

export async function getOddsByMatch(matchId: string): Promise<Odds[]> {
    return await oddsClient.getOddsByMatch(matchId);
}

export async function getOddsByLeague(leagueId: string): Promise<Odds[]> {
    return await oddsClient.getOddsByLeague(leagueId);
}