import { ApplicationSecurityError } from "../../security-error";

export class JWTDecodingError extends ApplicationSecurityError {
    constructor(message: string) {
        super(message);
        this.name = 'JWTDecodingError';
    }
}