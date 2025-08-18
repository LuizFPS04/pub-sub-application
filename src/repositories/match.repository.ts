import { Match } from "../types/matchType";
import MatchModel from "../models/matchModel";

export class MatchRepository {
    async createMatch(matchData: Omit<Match, '_id'>): Promise<Match> {
        const match = new MatchModel(matchData);
        return match.save();
    }

    async getMatchById(id: string): Promise<Match | null> {
        return MatchModel.findOne({ id: id });
    }

    async getMatchByLeague(leagueId: string): Promise<Match[] | null> {
        return MatchModel.findOne({ leagueId });
    }

    async updateMatch(id: string, updateData: Partial<Match>): Promise<Match | null> {
        return MatchModel.findOneAndUpdate({ id: id }, updateData, { new: true });
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
        console.log(JSON.stringify(matchData.score.fullTime))
        return MatchModel.updateOne(
            { id: matchData.id },
            { 
                $set: {
                    ...matchData,
                    matchName: `${matchData.competition.name} 2025 - Rodada ${matchData.season.currentMatchday} - ${matchData.homeTeam.shortName} × ${matchData.awayTeam.shortName}`,
                    score: matchData.score.fullTime
                } 
            },
            { upsert: true }
        );
    }
}