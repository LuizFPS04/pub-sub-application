import { Document, Types } from 'mongoose';

export interface Match extends Document {
    _id: Types.ObjectId;
    homeTeam: string;
    awayTeam: string;
    date: Date;
    score?: {
        home: number;
        away: number;
    };
    status: 'scheduled' | 'in_progress' | 'finished';
    leagueId: Types.ObjectId;
    events: MatchEvent[];
    referee?: string;
    stadium?: string;
}

type MatchEvent = {
    type: 'goal' | 'card' | 'substitution';
    team?: string;
    player?: string;
    minute?: number;
    details?: string; // Additional details about the event
};