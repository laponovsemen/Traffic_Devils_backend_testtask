import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { userService } from "../service/user.service";
import { ApiError } from "../exceptions/api.error";

export const userController = {
    async registration(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                next(ApiError.BadRequest('Validation error', errors.array()));
                return;
            }
            const userData = await userService.registration(req.body);
            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
                httpOnly: true
            });
            res.status(201).send({ accessToken: userData.accessToken, user: userData.user });
        } catch (e) {
            next(e);
        }
    },

    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, password } = req.body;
            const userData = await userService.login(email, password);
            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
                httpOnly: true
            });
            res.status(201).send({ accessToken: userData.accessToken, user: userData.user });
        } catch (e) {
            next(e);
        }
    },

    async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { refreshToken } = req.cookies;
            await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            res.sendStatus(204);
        } catch (e) {
            next(e);
        }
    },

    async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { refreshToken } = req.cookies;
            const userData = await userService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
                httpOnly: true
            });
            res.status(201).send({ accessToken: userData.accessToken, user: userData.user });
        } catch (e) {
            next(e);
        }
    },

    async registrationConfirmation(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const confirmationCode = req.params.code;
            await userService.confirmRegistration(confirmationCode);
            return res.redirect(process.env.CLIENT_URL!);
        } catch (e) {
            next(e);
        }
    },
    async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const users = await userService.getAllUsers();
            res.send(users);
        } catch (e) {
            next(e);
        }
    }
};
