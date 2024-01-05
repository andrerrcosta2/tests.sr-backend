import { ApplicationError } from "../../shared/domain/error/app.error";

export class CacheError extends ApplicationError {
    constructor(message: string) {
        super(message);
        this.name = 'CacheError';
    }
}