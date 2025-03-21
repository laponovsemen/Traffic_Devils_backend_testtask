import { Schema, model, Document } from "mongoose";
import {ObjectId} from "mongodb";

export const USER_MODEL_NAME = 'User';

interface IUser extends Document<ObjectId> {
    email: string;
    password: string;
    login: string;
    isConfirmed: boolean;
    confirmationCode: string | null;
}

export const UserSchema = new Schema<IUser>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    login: { type: String, required: true },
    isConfirmed: { type: Boolean, default: false },
    confirmationCode: { type: String }
});

export const UserModel = model<IUser>(USER_MODEL_NAME, UserSchema);
