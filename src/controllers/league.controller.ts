import * as leagueService from '../services/league.service';
import { Request, Response } from 'express';

export async function insertLegue(req: Request, res: Response): Promise<any> {
    try {

        const { name, country, season, teams, leagueId } = req.body;

        const leagueToEnteredBody: any = { 
            name, 
            country, 
            season, 
            teams, 
            leagueId 
        };

        const leagueToEntered = await leagueService.createLeague(leagueToEnteredBody);

        if (!leagueToEntered) {
            return res.status(400).send({
                success: false,
                message: 'Failed to create league',
            });
        }

        return res.status(201).send({
            success: true,
            message: 'League created successfully',
            data: leagueToEntered,
        }); 

    } catch (error: any) {
        console.error(error);
        return res.status(error.status || 500).send({
            success: false,
            message: error.message || 'Internal server error',
        });
    }
}