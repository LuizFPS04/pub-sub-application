import { Schema, model } from 'mongoose';
import { League } from '../types/leagueType';

const leagueSchema = new Schema<League>({
    name: { type: String, required: true },
    country: { type: String, required: true },
    season: { type: String, required: true },
    teams: [{ type: String }],
    leagueId: { type: Number, required: true }
}, {
    timestamps: true
});

const LeagueModel = model<League>('League', leagueSchema);

export default LeagueModel;