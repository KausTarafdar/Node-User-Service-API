import bcrypt from "bcryptjs";

import User, { IUser } from "../models/User";

export interface IUserData {
    username?: string;
    email?: string;
    password?: string;
    gender?: string;
    dateOfBirth?: Date;
    country?: string;
}

export class UserRepository {
    async createNewUser(userData: IUserData): Promise<IUser | null> {
        try {
            const newUser = new User(userData);
            return await newUser.save();
        } catch (error) {
            console.error("Error creating user:", error);
            return null;
        }
    }

    async checkUserCredentials(userData: IUserData): Promise<IUser | null> {
        try {
            const user = await User.findOne({email: userData.email});

            if (!user || !userData.password) return null;
            const isPasswordValid = await bcrypt.compare(userData.password, user.password);
            return isPasswordValid ? user : null;
        } catch (error) {
            console.error("Error checking user credentials:", error);
            return null;
        }
    }

    async getUserProfileByEmailOrUsername(userData: IUserData): Promise<IUser | null> {
        try {
            return await User.findOne({
                $or: [
                    { email: userData.email },
                    { username: userData.username }
                ]
            }).select("-password");
        } catch (error) {
            console.error("Error fetching user profile:", error);
            return null;
        }
    }
}
