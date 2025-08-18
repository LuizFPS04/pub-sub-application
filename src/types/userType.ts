import { Document, Types } from 'mongoose';

export interface User extends Document {
    _id: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    followedTeams: any[];
    isActive?: boolean;
    otherTeams?: string[];
}