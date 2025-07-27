import { League } from "../types/leagueType";
import LeagueModel from "../models/leagueModel";

export class LeagueRepository {
    async createLeague(leagueData: Omit<League, '_id'>): Promise<League> {
        const league = new LeagueModel(leagueData);
        return league.save();
    }

    async getLeagueById(id: string): Promise<League | null> {
        return LeagueModel.findById(id);
    }

    async updateLeague(id: string, updateData: Partial<League>): Promise<League | null> {
        return LeagueModel.findByIdAndUpdate(id, updateData, { new: true });
    }

    async deleteLeague(id: string): Promise<League | null> {
        return LeagueModel.findByIdAndDelete(id);
    }

    async getAllLeagues(): Promise<League[]> {
        return LeagueModel.find();
    }

    async deleteAllLeagues(): Promise<void> {
        await LeagueModel.deleteMany({});
    }
}