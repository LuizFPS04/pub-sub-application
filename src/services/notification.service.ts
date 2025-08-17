import { Notification } from "../types/notificationType";
import { NotificationRepository } from "../repositories/notification.repository";
import { Types } from "mongoose";

const notificationClient = new NotificationRepository();

export async function createNotification(notification: Omit<Notification, "_id">): Promise<Notification> {
    return await notificationClient.createNotification(notification);
}

export async function getNotificationById(id: string | Types.ObjectId): Promise<Notification | null> {
    return notificationClient.getNotificationById(id);
}

export async function updateNotification(id: string | Types.ObjectId, updateData: Partial<Notification>): Promise<Notification | null> {
    return await notificationClient.updateNotification(id, updateData);
}

export async function deleteNotification(id: string | Types.ObjectId): Promise<Notification | null> {
    return await notificationClient.deleteNotification(id);
}

export async function getAllNotifications(): Promise<Notification[]> {
    return notificationClient.getAllNotifications();
}

export async function getNotificationsByUser(userId: string | Types.ObjectId): Promise<Notification[]> {
    return notificationClient.getNotificationsByUser(userId);
}

export async function getNotificationsByMatch(matchId: string | Types.ObjectId): Promise<Notification[]> {
    return notificationClient.getNotificationsByMatch(matchId);
}

export async function deleteAllNotifications(): Promise<void> {
    return notificationClient.deleteAllNotifications();
}
