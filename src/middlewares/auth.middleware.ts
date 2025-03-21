import { Request, Response, NextFunction } from "express";
import { ApiError } from "../exceptions/api.error";
import { tokenService } from "../service/token.service";

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            next(ApiError.UnauthorizedError());
            return;
        }

        const accessToken = authHeader.split(' ')[1];
        if (!accessToken) {
            next(ApiError.UnauthorizedError());
            return;
        }

        const userData = tokenService.validateAccessToken(accessToken);
        if (!userData) {
            next(ApiError.UnauthorizedError());
            return;
        }

        req.user = userData;
        next();
    } catch (e) {
        console.log(e);
        next(ApiError.UnauthorizedError());
    }
};
