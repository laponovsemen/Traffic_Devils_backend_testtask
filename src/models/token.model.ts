import { Schema, model, Document } from "mongoose";
import { USER_MODEL_NAME } from "./user.model";
import {ObjectId} from "mongodb";

export const TOKEN_MODEL_NAME = 'Token';

interface IToken extends Document<ObjectId> {
    user: Schema.Types.ObjectId;
    refreshToken: string;
}

const TokenSchema = new Schema<IToken>({
    user: { type: Schema.Types.ObjectId, ref: USER_MODEL_NAME },
    refreshToken: { type: String, required: true },
});

export const TokenModel = model<IToken>(TOKEN_MODEL_NAME, TokenSchema);
