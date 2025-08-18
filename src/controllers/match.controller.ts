import * as matchService from '../services/match.service';
import { Request, Response } from 'express';

export async function insertMatch(req: Request, res: Response): Promise<any> {
    try {

        const {
            homeTeam,
            awayTeam,
            date,
            score,
            status,
            leagueId,
            events,
            referee,
            stadium
        } = req.body;

        const matchToEnteredBody: any = {
            homeTeam,
            awayTeam,
            date,
            score,
            status,
            leagueId,
            events,
            referee,
            stadium
        };

        const matchToEntered = await matchService.insertMatch(matchToEnteredBody);

        if (!matchToEntered) {
            return res.status(400).send({
                success: false,
                message: 'Failed to create match',
            });
        }

        return res.status(201).send({
            success: true,
            message: 'Mathc created successfully',
            data: matchToEntered,
        });

    } catch (error: any) {
        console.error(error);
        return res.status(error.status || 500).send({
            success: false,
            message: error.message || 'Internal server error',
        });
    }
}

export async function updateMatch(req: Request, res: Response): Promise<any> {
    try {
        const { id } = req.params;
        const matchData = req.body;

        const updatedMatch = await matchService.updateMatch(id, matchData);

        if (!updatedMatch) {
            return res.status(404).send({
                success: false,
                message: 'Match not found',
            });
        }

        return res.status(200).send({
            success: true,
            message: 'Match updated successfully',
            data: updatedMatch,
        });

    } catch (error: any) {
        console.error(error);
        return res.status(error.status || 500).send({
            success: false,
            message: error.message || 'Internal server error',
        });
    }
}

export async function getAllMatches(req: Request, res: Response): Promise<any> {
    try {

        const matches = matchService.getAllMatches();

        if (!matches) {
            return res.status(404).send({
                success: false,
                message: 'No matches found',
            });
        }

        return res.status(200).send({
            success: true,
            message: 'Matches fetched successfully',
            data: matches,
        });

    } catch (error: any) {
        console.error(error);
        return res.status(error.status || 500).send({
            success: false,
            message: error.message || 'Internal server error',
        });
    }
}

export async function getMatchById(req: Request, res: Response): Promise<any> {
    try {

        const id: any = req.query.id;
        const match = matchService.getMatchById(id);

        if (!match) {
            return res.status(404).send({
                success: false,
                message: 'No match found',
            });
        }

        return res.status(200).send({
            success: true,
            message: 'Match fetched successfully',
            data: match,
        });

    } catch (error: any) {
        console.error(error);
        return res.status(error.status || 500).send({
            success: false,
            message: error.message || 'Internal server error',
        });
    }
}

export async function getMatchByLeague(req: Request, res: Response): Promise<any> {
    try {

        const leagueId: any = req.query.leagueId;
        const matches = matchService.getMatchByLeague(leagueId);

        if (!matches) {
            return res.status(404).send({
                success: false,
                message: 'No match found',
            });
        }

        return res.status(200).send({
            success: true,
            message: 'Match fetched successfully',
            data: matches,
        });

    } catch (error: any) {
        console.error(error);
        return res.status(error.status || 500).send({
            success: false,
            message: error.message || 'Internal server error',
        });
    }
}

export async function syncNow(req: Request, res: Response) {
    const matches = await matchService.syncMatches();
    res.json({ success: true, total: matches.length });
}