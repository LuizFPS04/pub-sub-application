import * as notificationService from '../services/notification.service';
import { Request, Response } from 'express';

export async function createNotification(req: Request, res: Response): Promise<any> {
    try {

        const { userId, types, message, team, matchId } = req.body;

        const notificationToEnteredBody: any = {
            userId, 
            types, 
            message, 
            team,
            matchId
        };

        const notificationToEntered = await notificationService.createNotification(notificationToEnteredBody);

        if (!notificationToEntered) {
            return res.status(400).send({
                success: false,
                message: 'Failed to create notification',
            });
        }

        return res.status(201).send({
            success: true,
            message: 'Notification created successfully',
            data: notificationToEntered,
        });

    } catch (error: any) {
        console.error(error);
        return res.status(error.status || 500).send({
            success: false,
            message: error.message || 'Internal server error',
        });
    }
}

export async function getAllNotifications(req: Request, res: Response): Promise<any> {
    try {

        const notifications = notificationService.getAllNotifications();

        if (!notifications) {
            return res.status(404).send({
                success: false,
                message: 'No notifications found',
            });
        }

        return res.status(200).send({
            success: true,
            message: 'Notifications fetched successfully',
            data: notifications,
        });

    } catch (error: any) {
        console.error(error);
        return res.status(error.status || 500).send({
            success: false,
            message: error.message || 'Internal server error',
        });
    }
}

export async function getNotificationById(req: Request, res: Response): Promise<any> {
    try {

        const id: any = req.query._id;
        const notification = notificationService.getNotificationById(id);

        if (!notification) {
            return res.status(404).send({
                success: false,
                message: 'No notification found',
            });
        }

        return res.status(200).send({
            success: true,
            message: 'Notification fetched successfully',
            data: notification,
        });

    } catch (error: any) {
        console.error(error);
        return res.status(error.status || 500).send({
            success: false,
            message: error.message || 'Internal server error',
        });
    }
}

export async function getNotificationsByUser(req: Request, res: Response): Promise<any> {
    try {

        const userId: any = req.query.userId;
        const notifications = notificationService.getNotificationsByUser(userId);

        if (!notifications) {
            return res.status(404).send({
                success: false,
                message: 'No match found',
            });
        }

        return res.status(200).send({
            success: true,
            message: 'Match fetched successfully',
            data: notifications,
        });

    } catch (error: any) {
        console.error(error);
        return res.status(error.status || 500).send({
            success: false,
            message: error.message || 'Internal server error',
        });
    }
}

export async function getNotificationsByMatch(req: Request, res: Response): Promise<any> {
    try {

        const matchId: any = req.query.matchId;
        const notifications = notificationService.getNotificationsByMatch(matchId);

        if (!notifications) {
            return res.status(404).send({
                success: false,
                message: 'No match found',
            });
        }

        return res.status(200).send({
            success: true,
            message: 'Match fetched successfully',
            data: notifications,
        });

    } catch (error: any) {
        console.error(error);
        return res.status(error.status || 500).send({
            success: false,
            message: error.message || 'Internal server error',
        });
    }
}