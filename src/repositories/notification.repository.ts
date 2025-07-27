import { Odds } from '../types/oddsType';
import OddsModel from '../models/oddsModel';

export class OddsRepository {
    async createOdds(oddsData: Omit<Odds, '_id'>): Promise<Odds> {
        const odds = new OddsModel(oddsData);
        return odds.save();
    }

    async getOddsById(id: string): Promise<Odds | null> {
        return OddsModel.findById(id);
    }

    async updateOdds(id: string, updateData: Partial<Odds>): Promise<Odds | null> {
        return OddsModel.findByIdAndUpdate(id, updateData, { new: true });
    }

    async deleteOdds(id: string): Promise<Odds | null> {
        return OddsModel.findByIdAndDelete(id);
    }

    async getAllOdds(): Promise<Odds[]> {
        return OddsModel.find();
    }

    async deleteAllOdds(): Promise<void> {
        await OddsModel.deleteMany({});
    }
}