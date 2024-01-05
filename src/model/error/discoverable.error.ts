import { ApplicationError } from "../../shared/domain/error/app.error";

export class DiscoverableError extends ApplicationError {
    private _type: string;
    constructor(error: unknown, message: string) {
        super(message);
        this.name = 'DiscoverableError';
        this._type = this.discoverErrorType(error);
    }

    get type(): string {
        return this._type;
    }

    private discoverErrorType(error: unknown): string {
        if (error instanceof Error) {
            return error.constructor.name;
        }
        return 'UnknownErrorType';
    }
}