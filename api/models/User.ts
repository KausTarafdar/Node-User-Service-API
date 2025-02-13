import mongoose, { Schema } from "mongoose";

interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    fullName: string;
    gender: string;
    dateOfBirth: Date;
    country: string;
  }

const UserSchema: Schema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    gender: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    country: { type: String, required: true }
}, { timestamps: true });

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
