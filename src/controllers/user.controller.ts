import * as userService from '../services/user.service';
import { Request, Response } from 'express';

export async function insertUser(req: Request, res: Response): Promise<any> {
    try {

        const { name, email, password, firstTeam, otherTeams } = req.body;

        const userToEnteredBody: any = { 
            name, 
            email, 
            password, 
            firstTeam, 
            otherTeams 
        };

        const userToEntered = await userService.createUser(userToEnteredBody);

        if (!userToEntered) {
            return res.status(400).send({
                success: false,
                message: 'Failed to create user',
            });
        }

        return res.status(201).send({
            success: true,
            message: 'User created successfully',
            data: userToEntered,
        }); 

    } catch (error: any) {
        console.error(error);
        return res.status(error.status || 500).send({
            success: false,
            message: error.message || 'Internal server error',
        });
    }
}

export async function getAllUsers(req: Request, res: Response): Promise<any> {
    try {

        const users = await userService.getAllUsers();

        if (!users) {
            return res.status(404).send({
                success: false,
                message: 'No users found',
            });
        }

        return res.status(200).send({
            success: true,
            message: 'Users fetched successfully',
            data: users,
        });

    } catch (error: any) {
        console.error(error);
        return res.status(error.status || 500).send({
            success: false,
            message: error.message || 'Internal server error',
        });
    }
}

export async function getUserById(req: Request, res: Response): Promise<any> {
    try {

        const { id }: any = req.params;

        const user = await userService.getUserById(id);

        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'No user found',
            });
        }

        return res.status(200).send({
            success: true,
            message: 'User fetched successfully',
            data: user,
        });

    } catch (error: any) {
        console.error(error);
        return res.status(error.status || 500).send({
            success: false,
            message: error.message || 'Internal server error',
        });
    }
}

export async function findUserByEmail(req: Request, res: Response): Promise<any> {
    try {

        const mail: any = req.query.mail;

        const user = await userService.findUserByEmail(mail);

        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'No user found',
            });
        }

        return res.status(200).send({
            success: true,
            message: 'User fetched successfully',
            data: user,
        });

    } catch (error: any) {
        console.error(error);
        return res.status(error.status || 500).send({
            success: false,
            message: error.message || 'Internal server error',
        });
    }
}