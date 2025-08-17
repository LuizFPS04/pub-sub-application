import { League } from "../types/leagueType";
import LeagueModel from "../models/leagueModel";

export class LeagueRepository {
    async createLeague(leagueData: Omit<League, '_id'>): Promise<League> {
        const league = new LeagueModel(leagueData);
        return league.save();
    }

    async getLeagueById(leagueId: string): Promise<League | null> {
        return LeagueModel.findOne({leagueId });
    }

    async updateLeague(leagueId: string, updateData: Partial<League>): Promise<League | null> {
        return LeagueModel.findOneAndUpdate({ leagueId }, updateData, { new: true });
    }

    async deleteLeague(leagueId: string): Promise<League | null> {
        return LeagueModel.findOneAndDelete({ leagueId });
    }

    async getAllLeagues(): Promise<League[]> {
        return LeagueModel.find();
    }

    async deleteAllLeagues(): Promise<void> {
        await LeagueModel.deleteMany({});
    }
}