import { Document, Types } from 'mongoose';

export interface Notification extends Document {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    type: String;
    message: string;
    team?: String;
    matchId?: Types.ObjectId;
}