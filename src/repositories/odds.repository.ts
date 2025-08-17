import { Odds } from "../types/oddsType";
import OddsModel from "../models/oddsModel";
import { Types } from "mongoose";

export class OddsRepository {

    async insertOdd(oddData: Omit<Odds, '_id'>): Promise<Odds> {
        const odds = new OddsModel(oddData);
        return odds.save();
    }

    async getAllOdds(): Promise<Odds[]> {
        return OddsModel.find();
    }

    async getOddById(id: string | Types.ObjectId): Promise<Odds | null> {
        return OddsModel.findById(id);
    }

    async updateOdd(id: string | Types.ObjectId, updateData: Partial<Odds>): Promise<Odds | null> {
        return OddsModel.findByIdAndUpdate(id, updateData, { new: true });
    }

    async deleteOdd(id: string | Types.ObjectId): Promise<Odds | null> {
        return OddsModel.findByIdAndDelete(id);
    }

    async getOddsByMatch(matchId: string | Types.ObjectId): Promise<Odds[]> {
        return OddsModel.find({ matchId });
    }

    async getOddsByLeague(leagueId: string | Types.ObjectId): Promise<Odds[]> {
        return OddsModel.find({ leagueId });
    }
}