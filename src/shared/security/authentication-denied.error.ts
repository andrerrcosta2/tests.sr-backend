import { ApplicationSecurityError } from "./security-error";

export class AuthenticationDeniedError extends ApplicationSecurityError {
    constructor(message: string) {
        super(message);
        this.name = 'AuthenticationDeniedError';
    }
}