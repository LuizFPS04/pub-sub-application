import { Document, Types } from 'mongoose';

export interface User extends Document {
    _id: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    firstTeam: string;
    isActive?: boolean;
    otherTeams?: string[];
}