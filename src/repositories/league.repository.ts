import { League } from "../types/leagueType";
import LeagueModel from "../models/leagueModel";
import { TeamRepository } from "./team.repository";

export class LeagueRepository {
    constructor(private teamRepo: TeamRepository) { }

    async createLeague(leagueData: Omit<League, '_id'>): Promise<League> {
        const league = new LeagueModel(leagueData);
        return league.save();
    }

    async getLeagueById(leagueId: string): Promise<League | null> {
        return LeagueModel.findOne({ leagueId }).populate('teams');
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

    async upsertLeague(leagueData: any) {

        const league = await LeagueModel.updateOne(
            { leagueId: leagueData.competition.id },
            {
                $set: {
                    leagueId: leagueData.competition.id,
                    name: leagueData.competition.name,
                    country: 'BRA',
                    season: leagueData.filters.season
                }
            },
            { upsert: true, new: true }
        );

        const teamIds: string[] = [];

        const leagueId = await this.getLeagueById(leagueData.competition.id);

        for (const team of leagueData.teams) {
            const teamUpsert = await this.teamRepo.upsertTeam({
                id: team.id,
                name: team.name,
                shortName: team.shortName,
                tla: team.tla,
                website: team.website,
                clubColors: team.clubColors,
                stadium: team.venue,
                leagueId: leagueId ? leagueId._id.toString() : null
            });

            teamIds.push(teamUpsert._id.toString());
        }

        await LeagueModel.findOneAndUpdate(
            { leagueId: leagueData.competition.id },
            {
                $set: {
                    teams: teamIds
                }
            }
        )

        return league;
    }


}