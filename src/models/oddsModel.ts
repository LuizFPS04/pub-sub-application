import { Schema, model } from 'mongoose';
import { Odds } from '../types/oddsType';

const oddsSchema = new Schema<Odds>({
    homeTeam: { type: String, required: true },
    awayTeam: { type: String, required: true },
    house: { type: String, required: true },
    odds: {
        home: { type: Number, required: true },
        draw: { type: Number, required: true },
        away: { type: Number, required: true }
    },
    date: { type: Date, required: true },
    updateOdds: { type: Date },
    leagueId: { type: Schema.Types.ObjectId, ref: 'League' },
    matchId: { type: Schema.Types.ObjectId, ref: 'Match', required: true }
}, {
    timestamps: true
});

const OddsModel = model<Odds>('Odds', oddsSchema);

export default OddsModel;