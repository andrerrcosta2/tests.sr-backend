import { ApplicationError } from "../../shared/domain/error/app.error";

export class RepositoryError extends ApplicationError {
    constructor(message: string) {
        super(message);
        this.name = 'RepositoryError';
    }
}