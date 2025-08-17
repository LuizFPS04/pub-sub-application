import { Match } from "../types/matchType";
import MatchModel from "../models/matchModel";

export class MatchRepository {
    async createMatch(matchData: Omit<Match, '_id'>): Promise<Match> {
        const match = new MatchModel(matchData);
        return match.save();
    }

    async getMatchById(id: string): Promise<Match | null> {
        return MatchModel.findById(id);
    }

    async getMatchByLeague(leagueId: string): Promise<Match[] | null> {
        return MatchModel.findOne({ leagueId });
    }

    async updateMatch(id: string, updateData: Partial<Match>): Promise<Match | null> {
        return MatchModel.findByIdAndUpdate(id, updateData, { new: true });
    }

    async deleteMatch(id: string): Promise<Match | null> {
        return MatchModel.findByIdAndDelete(id);
    }

    async getAllMatches(): Promise<Match[]> {
        return MatchModel.find();
    }

    async deleteAllMatches(): Promise<void> {
        await MatchModel.deleteMany({});
    }

    async upsertMatch(matchData: any) {
        return MatchModel.updateOne(
            { id: matchData.id },
            { $set: matchData },
            { upsert: true }
        );
    }
}