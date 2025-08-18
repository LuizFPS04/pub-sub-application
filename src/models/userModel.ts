import { Schema, Types, model } from 'mongoose';
import { User } from '../types/userType';

const userSchema = new Schema<User>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    followedTeams: [{ type: Schema.Types.ObjectId, ref: "Team" }],
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true
});

const UserModel = model<User>('User', userSchema);

export default UserModel;