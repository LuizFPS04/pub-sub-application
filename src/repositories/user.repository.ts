import bcrypt from "bcryptjs";
import { User } from "../types/userType";
import UserModel from "../models/userModel";
import { Types } from "mongoose";

export class UserRepository {
    async createUser(userData: Omit<User, '_id'>): Promise<User> {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = new UserModel({ ...userData, password: hashedPassword });
        return user.save();
    }

    async findUserFollowedTeams(teamIds: any): Promise<User[] | null> {
        return UserModel.find({ followedTeams: { $in: teamIds } })
    }

    async findUserByEmail(email: string): Promise<User | null> {
        return UserModel.findOne({ email });
    }

    async updateUser(id: Types.ObjectId, updateData: Partial<User>): Promise<User | null> {
        return UserModel.findByIdAndUpdate(id, updateData, { new: true });
    }

    async deleteUser(id: Types.ObjectId): Promise<User | null> {
        return UserModel.findByIdAndDelete(id);
    }

    async getUserById(id: Types.ObjectId): Promise<User | null> {
        return UserModel.findById(id);
    }

    async getAllUsers(): Promise<User[]> {
        return UserModel.find();
    }

    async activateUser(id: string): Promise<User | null> {
        return UserModel.findByIdAndUpdate(id, { isActive: true }, { new: true });
    }

    async desactivateUser(id: string): Promise<User | null> {
        return UserModel.findByIdAndUpdate(id, { isActive: false }, { new: true });
    }

    async deleteAllUsers(): Promise<void> {
        await UserModel.deleteMany({});
    }
}