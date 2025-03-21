import { Request, Response, NextFunction } from "express";
import { ApiError } from "../exceptions/api.error";

export const errorMiddleware = (
        err: Error | ApiError,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    console.log(err);

    if (err instanceof ApiError) {
        res.status(err.status).send({
            message: err.message,
            errors: err.errors
        });
        return;
    }

    res.status(500).send({ message: 'Internal Server Error' });
};
