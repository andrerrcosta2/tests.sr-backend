import { ApplicationSecurityError } from "../../security-error";

export class JWTSignatureError extends ApplicationSecurityError {
    constructor(message: string) {
        super(message);
        this.name = 'JWTSignatureError';
    }
}