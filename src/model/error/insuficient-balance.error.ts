import { ApplicationError } from "../../shared/domain/error/app.error";

export class InsuficientBalanceError extends ApplicationError {
    constructor(message: string) {
        super(message);
        this.name = 'InsuficientBalanceError';
    }
}