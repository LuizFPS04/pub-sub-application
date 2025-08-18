import { Team } from "../types/teamType";
import TeamModel from "../models/teamModel";

export class TeamRepository {
    async insertTeam(teamData: Omit<Team, '_id'>): Promise<Team> {
        const team = new TeamModel(teamData);
        return team.save();
    }

    async getTeamById(teamId: string): Promise<Team | null> {
        return TeamModel.findOne({ id: teamId });
    }

    async updateTeam(teamId: string, updateData: Partial<Team>): Promise<Team | null> {
        return TeamModel.findOneAndUpdate({ teamId }, updateData, { new: true });
    }

    async deleteTeam(teamId: string): Promise<Team | null> {
        return TeamModel.findOneAndDelete({ teamId });
    }

    async getAllTeams(): Promise<Team[]> {
        return TeamModel.find();
    }

    async deleteAllTeams(): Promise<void> {
        await TeamModel.deleteMany({});
    }

    async upsertTeam(teamData: any) {
        return TeamModel.findOneAndUpdate(
            { id: teamData.id },
            {
                $set: {
                    id: teamData.id,
                    name: teamData.name,
                    shortName: teamData.shortName,
                    tla: teamData.tla,
                    website: teamData.website,
                    clubColors: teamData.clubColors,
                    stadium: teamData.venue,
                    leagueId: teamData.leagueId
                }
            },
            { upsert: true, new: true }
        );
    }

    async upsertTeamStanding(teamData: any) {
        return TeamModel.updateOne(
            { id: teamData.team.id },
            {
                $set: {
                    id: teamData.team.id,
                    position: teamData.position,
                    points: teamData.points,
                    playedGames: teamData.playedGames,
                    won: teamData.won,
                    draw: teamData.draw,
                    lost: teamData.lost,
                    goalDifference: teamData.goalDifference,
                    goalsAgainst: teamData.goalsAgainst,
                    goalsFor: teamData.goalsFor
                }
            },
            { upsert: true, new: true }
        );
    }
}