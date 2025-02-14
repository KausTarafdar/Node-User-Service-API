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
            if (!userData.username || !userData.email || !userData.password || !userData.gender || !userData.dateOfBirth || !userData.country) {
                throw new Error("Missing required fields: username, email, password, gender, dateOfBirth, country");
            }

            const newUser = new User(userData);
            return await newUser.save();
        } catch (error) {
            console.error("Error creating user:", error);
            return null;
        }
    }

    async checkUserCredentials(email: string, password: string): Promise<IUser | null> {
        try {
            const user = await User.findOne({ email });
            if (!user) return null;

            const isPasswordValid = await bcrypt.compare(password, user.password);
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
