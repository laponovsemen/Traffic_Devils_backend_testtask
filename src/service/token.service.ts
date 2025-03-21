import jwt, {Secret, PrivateKey, SignOptions} from 'jsonwebtoken';
import { TokenModel } from '../models/token.model';
import dotenv from 'dotenv';

dotenv.config();

interface TokenPayload {
    [key: string]: any;
}

export const tokenService = {
    generateTokens(payload: TokenPayload) {
        const accessToken = jwt.sign(
            payload,
            process.env.JWT_ACCESS_SECRET! as Secret | PrivateKey,
            { expiresIn: process.env.ACCESS_TOKEN_LIFE_SPAN  } as SignOptions
        );
        const refreshToken = jwt.sign(
            payload,
            process.env.JWT_REFRESH_SECRET! as Secret | PrivateKey,
            { expiresIn: process.env.REFRESH_TOKEN_LIFE_SPAN } as SignOptions
        );
        return {
            accessToken,
            refreshToken
        };
    },

    async saveToken(userId: string, refreshToken: string) {
        const foundTokenData = await TokenModel.findOne({ user: userId });
        if (foundTokenData) {
            foundTokenData.refreshToken = refreshToken;
            return foundTokenData.save();
        }
        return TokenModel.create({
            user: userId,
            refreshToken: refreshToken
        });
    },

    async removeToken(refreshToken: string) {
        return TokenModel.deleteOne({ refreshToken }).exec();
    },

    validateAccessToken(token: string) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as TokenPayload;
            return userData;
        } catch (e) {
            return null;
        }
    },

    validateRefreshToken(token: string) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as TokenPayload;
            return userData;
        } catch (e) {
            return null;
        }
    },

    async findToken(refreshToken: string) {
        const tokenData = await TokenModel.findOne({ refreshToken });
        return tokenData;
    }
};
