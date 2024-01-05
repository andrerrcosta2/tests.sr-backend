import { ApplicationError } from "../../shared/domain/error/app.error";

export class ModelError extends ApplicationError {
    constructor(message: string) {
        super(message);
        this.name = 'ModelError';
    }
}