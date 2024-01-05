import { ApplicationError } from "../../shared/domain/error/app.error";

export class EntityNotFoundError extends ApplicationError {
    constructor(message: string) {
      super(message);
      this.name = 'EntityNotFoundError';
    }
  }