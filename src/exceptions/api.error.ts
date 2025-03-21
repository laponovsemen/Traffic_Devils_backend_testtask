

export class ApiError<T extends any = string> extends Error {
    status: number;
    errors: T[];

    constructor(status: number, message: string, errors: any[] = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static UnauthorizedError(message?: string): ApiError {
    return new ApiError(401, message ?? 'Unauthorized');
}

static BadRequest<T>(message: string, errors: T[] = []): ApiError<T> {
    return new ApiError(400, message, errors);
}
}
