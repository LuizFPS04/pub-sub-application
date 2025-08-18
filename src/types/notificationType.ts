import { Document, Types } from 'mongoose';

export interface Notification extends Document {
    _id: Types.ObjectId;
    userId: Types.ObjectId | string;
    type: String;
    message: string;
    teams?: String[];
    matchId?: Types.ObjectId | string;
}