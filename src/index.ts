import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { Router } from 'express';

import { authRouter } from './router/authRouter';
import { arbitraryDataRouter } from './router/arbitraryDataRouter';
import { errorMiddleware } from './middlewares/error.middleware';

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;
const CLIENT_URL = process.env.CLIENT_URL;

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: CLIENT_URL,
}));

const globalPrefixRoute = Router();
globalPrefixRoute.use('/auth', authRouter);
globalPrefixRoute.use('/arbitrary', arbitraryDataRouter);

app.use('/api', globalPrefixRoute);

app.use(errorMiddleware);

const start = async () => {
    try {
        if (!MONGO_URL) {
            throw new Error('MongoDB URL is missing in the environment variables.');
        }
        await mongoose.connect(MONGO_URL);
        console.log('Connected to MongoDB');

        app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
    } catch (e) {
        console.error('Error starting the server:', e);
    }
};

start();
