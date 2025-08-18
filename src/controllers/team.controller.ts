import * as teamService from '../services/team.service';
import { Request, Response } from 'express';

export async function getAllTeams(req: Request, res: Response): Promise<any> {
    try {
        const teams = await teamService.getAllTeams();
        return res.status(200).send({
            success: true,
            data: teams,
        });
    } catch (error: any) {
        console.error(error);
        return res.status(error.status || 500).send({
            success: false,
            message: error.message || 'Internal server error',
        });
    }
}

export async function getTeamById(req: Request, res: Response): Promise<any> {
    try {
        const { id } = req.params;
        const team = await teamService.getTeamById(id);

        if (!team) {
            return res.status(404).send({
                success: false,
                message: 'Team not found',
            });
        }

        return res.status(200).send({
            success: true,
            data: team,
        });
    } catch (error: any) {
        console.error(error);
        return res.status(error.status || 500).send({
            success: false,
            message: error.message || 'Internal server error',
        });
    }
}

export async function insertTeam(req: Request, res: Response): Promise<any> {
    try {
        const teamData = req.body;
        const team = await teamService.insertTeam(teamData);

        return res.status(201).send({
            success: true,
            message: 'Team created successfully',
            data: team,
        });
    } catch (error: any) {
        console.error(error);
        return res.status(error.status || 500).send({
            success: false,
            message: error.message || 'Internal server error',
        });
    }
}

export async function updateTeam(req: Request, res: Response): Promise<any> {
    try {
        const { id } = req.params;
        const teamData = req.body;

        const updatedTeam = await teamService.updateTeam(id, teamData);

        if (!updatedTeam) {
            return res.status(404).send({
                success: false,
                message: 'Team not found',
            });
        }

        return res.status(200).send({
            success: true,
            message: 'Team updated successfully',
            data: updatedTeam,
        });
    } catch (error: any) {
        console.error(error);
        return res.status(error.status || 500).send({
            success: false,
            message: error.message || 'Internal server error',
        });
    }
}

export async function deleteTeam(req: Request, res: Response): Promise<any> {
    try {
        const { id } = req.params;
        const deletedTeam = await teamService.deleteTeam(id);

        if (!deletedTeam) {
            return res.status(404).send({
                success: false,
                message: 'Team not found',
            });
        }

        return res.status(200).send({
            success: true,
            message: 'Team deleted successfully',
            data: deletedTeam,
        });
    } catch (error: any) {
        console.error(error);
        return res.status(error.status || 500).send({
            success: false,
            message: error.message || 'Internal server error',
        });
    }
}

export async function deleteAllTeams(req: Request, res: Response): Promise<any> {
    try {
        await teamService.deleteAllTeams();

        return res.status(200).send({
            success: true,
            message: 'All teams deleted successfully',
        });
    } catch (error: any) {
        console.error(error);
        return res.status(error.status || 500).send({
            success: false,
            message: error.message || 'Internal server error',
        });
    }
}

export async function syncTeams(req: Request, res: Response): Promise<any> {
    try {
        const teams = await teamService.syncTeams();

        return res.status(200).send({
            success: true,
            message: 'Teams synchronized successfully',
            data: teams,
        });
    } catch (error: any) {
        console.error(error);
        return res.status(error.status || 500).send({
            success: false,
            message: error.message || 'Internal server error',
        });
    }
}
