import { Schema, model } from 'mongoose';
import { Team } from '../types/teamType';

const teamSchema = new Schema<Team>({
    id: { type: Number, required: true },
    leagueId: { type: Schema.Types.ObjectId, ref: 'League' },
    name: { type: String, required: true },
    shortName: { type: String, required: true },
    tla: { type: String, required: true },
    website: { type: String },
    clubColors: { type: String },
    stadium: { type: String },
    form: { type: String },
    position: { type: Number },
    playedGames: { type: Number },
    won: { type: Number },
    draw: { type: Number },
    lost: { type: Number },
    points: { type: Number },
    goalDifference: { type: Number },
    goalsAgainst: { type: Number },
    goalsFor: { type: Number }, 
});

const TeamModel = model<Team>('Team', teamSchema);

export default TeamModel;