import { Notification } from "../types/notificationType";
import NotificationModel from "../models/notificationModel";
import { Types } from "mongoose";

export class NotificationRepository {
    async createNotification(notificationData: Omit<Notification, "_id">): Promise<Notification> {
        const notification = new NotificationModel(notificationData);
        return notification.save();
    }

    async getNotificationById(id: string | Types.ObjectId): Promise<Notification | null> {
        return NotificationModel.findById(id);
    }

    async updateNotification(id: string | Types.ObjectId, updateData: Partial<Notification>): Promise<Notification | null> {
        return NotificationModel.findByIdAndUpdate(id, updateData, { new: true });
    }

    async deleteNotification(id: string | Types.ObjectId): Promise<Notification | null> {
        return NotificationModel.findByIdAndDelete(id);
    }

    async getAllNotifications(): Promise<Notification[]> {
        return NotificationModel.find();
    }

    async getNotificationsByUser(userId: string | Types.ObjectId): Promise<Notification[]> {
        return NotificationModel.find({ userId });
    }

    async getNotificationsByMatch(matchId: string | Types.ObjectId): Promise<Notification[]> {
        return NotificationModel.find({ matchId });
    }

    async deleteAllNotifications(): Promise<void> {
        await NotificationModel.deleteMany({});
    }
}