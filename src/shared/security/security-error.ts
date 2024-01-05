import { ApplicationError } from "../domain/error/app.error";

export class ApplicationSecurityError extends ApplicationError {
    constructor(message: string) {
        super(message);
        this.name = 'ApplicationSecurityError';
    }
}