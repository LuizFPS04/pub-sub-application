import { Schema, model } from 'mongoose';
import { Notification } from '../types/notificationType';

const notificationSchema = new Schema<Notification>({
    userId: { type: Schema.Types.ObjectId, required: true },
    type: { type: String, required: true },
    message: { type: String, required: true },
    team: { type: String },
    matchId: { type: Schema.Types.ObjectId }
}, {
    timestamps: true
});

const NotificationModel = model<Notification>('Notification', notificationSchema);

export default NotificationModel;