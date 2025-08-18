import { Schema, model } from 'mongoose';
import { Match } from '../types/matchType';

const matchSchema = new Schema<Match>({
    id: { type: String, required: true },
    matchName: { type: String, required: true },
    homeTeam: {
        id: Number,
        name: String,
        shortName: String,
        tla: String,
        crest: String
    },
    awayTeam: {
        id: Number,
        name: String,
        shortName: String,
        tla: String,
        crest: String
    },
    date: { type: Date, required: true },
    score: {
        home: { type: Number, default: 0 },
        away: { type: Number, default: 0 }
    },
    status: {
        type: String,
        enum: ['TIMED', 'IN_PLAY', 'FINISHED'],
        default: 'TIMED'
    },
    leagueId: { type: Schema.Types.ObjectId, ref: 'League', required: true },
    events: [{
        type: {
            type: String,
            enum: ['goal', 'card', 'substitution']
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