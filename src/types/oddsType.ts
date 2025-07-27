import { Document, Types } from 'mongoose';

export interface Odds extends Document {
    _id: Types.ObjectId;
    homeTeam: string;
    awayTeam: string;
    house: string;
    odds: {
        home: number;
        draw: number;
        away: number;
    };
    date: Date;
    updateOdds?: Date;
    leagueId?: Types.ObjectId;
    matchId: Types.ObjectId;
}