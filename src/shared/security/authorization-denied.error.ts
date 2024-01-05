import { ApplicationSecurityError } from "./security-error";

export class AuthorizationDeniedError extends ApplicationSecurityError {
    constructor(message: string) {
        super(message);
        this.name = 'AuthorizationDeniedError';
    }
}