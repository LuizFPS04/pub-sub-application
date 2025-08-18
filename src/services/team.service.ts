import { Team } from "../types/teamType";
import { TeamRepository } from "../repositories/team.repository";
import { getTeams, getStanding } from "../integrations/footballApi";
import { appEvents } from "../events/eventEmitter";

const teamClient = new TeamRepository();

export async function insertTeam(team: Omit<Team, "_id">): Promise<Team> {
    return await teamClient.insertTeam(team);
}

export async function getAllTeams(): Promise<Team[]> {
    return await teamClient.getAllTeams();
}

export async function updateTeam(id: string, team: Team) {
    return await teamClient.updateTeam(id, team);
}

export async function getTeamById(id: string): Promise<Team | null> {
    return await teamClient.getTeamById(id);
}

export async function deleteTeam(id: string): Promise<Team | null> {
    return await teamClient.deleteTeam(id);
}

export async function deleteAllTeams(): Promise<void> {
    return await teamClient.deleteAllTeams();
}

export async function syncTeams() {
    const teams = await getStanding();

    for (const team of teams.standings[0].table) {

        const res = await teamClient.upsertTeamStanding(team);

        if (res.modifiedCount > 0) {
            appEvents.emit("updateTable", team);
        }
    }
    return teams;
}