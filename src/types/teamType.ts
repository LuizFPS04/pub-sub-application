import { Document, Types } from 'mongoose';

export interface Team extends Document {
    _id: Types.ObjectId;
    name: string;
    shortName: string;
    tla: string;
    crest?: string;
    website?: string;
    clubColors?: string;
    stadium?: string;
    position?: number;
    playedGames?: number;
    form?: string,
    won?: number;
    draw?: number;
    lost?: number;
    points?: number;
    goalsFor?: number;
    goalsAgainst?: number;
    goalDifference?: number;
    leagueId?: Types.ObjectId
}