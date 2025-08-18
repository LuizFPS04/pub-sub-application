import { Document, Types } from 'mongoose';
import { Team } from './teamType';

export interface Match extends Document {
    _id: Types.ObjectId;
    matchName: String,
    homeTeam: Team;
    awayTeam: Team;
    date: Date;
    score?: {
        home: number;
        away: number;
    };
    status: 'TIMED' | 'IN_PLAY' | 'FINISHED';
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
    details?: string;
};