import { ApplicationError } from "../../shared/domain/error/app.error";

export class DomainValidationError extends ApplicationError {
    constructor(message: string) {
        super(message);
        this.name = 'DomainValidationError';
    }
}