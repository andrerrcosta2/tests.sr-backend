import { ApplicationError } from "../../shared/domain/error/app.error";

export class ConfigurationError extends ApplicationError {
    constructor(message: string) {
        super(message);
        this.name = 'ConfigurationError';
    }
}