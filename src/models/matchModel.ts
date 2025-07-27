import { Schema, model } from 'mongoose';
import { Match } from '../types/matchType';

const matchSchema = new Schema<Match>({
    homeTeam: { type: String, required: true },
    awayTeam: { type: String, required: true },
    date: { type: Date, required: true },
    score: {
        home: { type: Number, default: 0 },
        away: { type: Number, default: 0 }
    },
    status: {
        type: String,
        enum: ['scheduled', 'in_progress', 'finished'],
        default: 'scheduled'
    },
    leagueId: { type: Schema.Types.ObjectId, ref: 'League', required: true },
    events: [{
        type: {
            type: String,
            enum: ['goal', 'card', 'substitution'],
            required: true
        },
        team: { type: String },
        player: { type: String },
        minute: { type: Number },
        details: { type: String }
    }],
    referee: { type: String },
    stadium: { type: String }
}, {
    timestamps: true
});

const MatchModel = model<Match>('Match', matchSchema);

export default MatchModel;