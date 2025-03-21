import { UserModel } from '../models/user.model';
import bcrypt from 'bcryptjs';
import { mailService } from './mail.service';
import { UserDto } from '../dto/user.dto';
import { tokenService } from './token.service';
import { ApiError } from '../exceptions/api.error';
import { ObjectId } from 'mongodb';

interface RegisterDto {
    email: string;
    password: string;
    login: string;
}

export const userService = {
    async registration(registerDto: RegisterDto) {
        const { email, password, login } = registerDto;

        const foundUser = await UserModel.findOne({ email });
        if (foundUser) {
            throw ApiError.BadRequest(`User with such email address ${email} already exists`);
        }

        const confirmationCode = crypto.randomUUID();
        const passwordHash = await bcrypt.hash(password, 5);

        const newUser = await UserModel.create({
            password: passwordHash,
            email,
            confirmationCode,
            login
        });

        try {
            await mailService.sendActivationMail(email, confirmationCode);
        } catch (error) {
            console.error(error, 'Error sending activation mail');
        }

        const userDto = new UserDto(newUser);
        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return { ...tokens, user: userDto };
    },

    async confirmRegistration(confirmationCode: string) {
        const user = await UserModel.findOne({ confirmationCode });
        if (!user) {
            throw ApiError.BadRequest(`Wrong confirmation link`);
        }

        user.confirmationCode = null;
        user.isConfirmed = true;
        await user.save();
    },

    async login(email: string, password: string) {
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw ApiError.UnauthorizedError(`Wrong email or password`);
        }

        const isPassEquals = await bcrypt.compare(password, user.password);
        if (!isPassEquals) {
            throw ApiError.UnauthorizedError(`Wrong email or password`);
        }

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return { ...tokens, user: userDto };
    },

    async logout(refreshToken: string) {
        const token = await tokenService.removeToken(refreshToken);
        if (!token.deletedCount) {
            throw ApiError.UnauthorizedError();
        }
    },

    async refresh(refreshToken: unknown) {
        if (!refreshToken || typeof refreshToken !== "string") {
            throw ApiError.UnauthorizedError();
        }

        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }

        const user = await UserModel.findById(new ObjectId(userData.id)).exec();
        if (!user) {
            throw ApiError.UnauthorizedError();
        }

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return { ...tokens, user: userDto };
    },

    async getAllUsers() {
        const users = await UserModel.find().lean();
        return users;
    }
};
