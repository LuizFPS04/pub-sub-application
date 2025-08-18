import { User } from "../types/userType";
import { UserRepository } from "../repositories/user.repository";
import { Types } from "mongoose";

const userClient = new UserRepository();

export async function getAllUsers(): Promise<User[]> {
    return await userClient.getAllUsers();
}

export async function getUserById(id: Types.ObjectId): Promise<User | null> {
    return await userClient.getUserById(id);
}

export async function findUserFollowedTeams(teams: any): Promise<User[] | null> {
    return await userClient.findUserFollowedTeams(teams);
}

export async function findUserByEmail(mail: string): Promise<User | null> {
    return await userClient.findUserByEmail(mail);
}

export async function deleteAllUsers(): Promise<void> {
    return await userClient.deleteAllUsers();
}

export async function deleteUser(mail: string): Promise<User | null> {
    let searchUser: User | null = await userClient.findUserByEmail(mail);

    if (!searchUser) {
        throw new Error("User not found");
    }

    const id: Types.ObjectId = searchUser._id;
    return await userClient.deleteUser(id);
}

export async function createUser(user: User): Promise<User> {
    return await userClient.createUser(user);
}

export async function updateUser(mail: string, user: User): Promise<User | null> {
    let searchUser: User | null = await userClient.findUserByEmail(mail);

    if (!searchUser) {
        throw new Error("User not found");
    }

    const id: Types.ObjectId = searchUser._id;

    return await userClient.updateUser(id, user);
}