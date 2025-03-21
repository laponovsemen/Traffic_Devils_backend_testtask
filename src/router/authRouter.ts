import { Router } from 'express';
import { userController } from '../api/user.controller';
import { body } from 'express-validator';
import { authMiddleware } from '../middlewares/auth.middleware';

export const authRouter = Router();

authRouter.post(
	'/registration',
	body('email').isEmail().withMessage('Email is required'),
	body('password')
		.isString()
		.withMessage('Password is required')
		.isLength({ min: 3, max: 30 }),
	body('login')
		.isString()
		.withMessage('Login is required')
		.isLength({ min: 3, max: 30 }),
	userController.registration
);

authRouter.post('/login', userController.login);

authRouter.post('/logout', userController.logout);

authRouter.post('/refresh-token', userController.refreshToken);

authRouter.get('/registration-confirmation/:code', userController.registrationConfirmation);

authRouter.get('/users', authMiddleware, userController.getUsers);
