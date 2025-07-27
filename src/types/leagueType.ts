import { Document, Types } from 'mongoose';

export interface League extends Document {
    _id: Types.ObjectId;
    name: string;
    country: string;
    season: string;
    teams?: string[];
    leagueId: Number
}