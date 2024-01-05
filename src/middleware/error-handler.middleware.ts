import { NextFunction, Request, Response } from 'express';
import { DiscoverableError } from '../model/error/discoverable.error';
import { ErrorResponse } from '../model/error/error.response';
import { dbg } from '../util/log/debug.log';
import { HttpStatusCode } from 'axios';
import { winston } from '../_cfg/logger.config';
import { EntityNotFoundError } from '../model/error/entity-not-found.error';
import { InsuficientBalanceError } from '../model/error/insuficient-balance.error';
import { CacheError } from '../model/error/cache.error';
import { AuthenticationDeniedError } from '../shared/security/authentication-denied.error';
import { AuthorizationDeniedError } from '../shared/security/authorization-denied.error';
import { isInstanceOfAny } from '../util/optional.util';
import { JWTSignatureError } from '../shared/security/jwt/error/jwt-signature.error';
import { JWTDecodingError } from '../shared/security/jwt/error/jwt-decoding.error';
import { FileReadError } from '../shared/io/file-read.error';

export const errorHandlerMiddleware = (error: ErrorResponse, req: Request, res: Response, next: NextFunction): void => {
  
  if (error instanceof DiscoverableError) {
    switch(error.type) {
      case "UniqueConstraintError":
    
        winston.info("Error: Unique Constraint Error");
        res.status(HttpStatusCode.BadRequest).json({
          message: "Bad Request: " + error.message,
          stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack,
        });
        break;
        default:
          winston.unexpected("Unexpected error:", error);
          res.status(HttpStatusCode.InternalServerError).json({
            message: "Server Error: " + error.message,
            stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack,
          });
          break;
    }
  } else {
    if (error instanceof EntityNotFoundError) {
        winston.info("Entity Not Found", error.message);
        res.status(HttpStatusCode.BadRequest).json({
          message: "Bad Request: " + error.message,
          stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack,
        });
    } else if (error instanceof InsuficientBalanceError) {
      winston.info("Insuficient funds", error.message);
      res.status(HttpStatusCode.BadRequest).json({
        message: "Bad Request: " + error.message,
        stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack,
      });
    } else if (error instanceof AuthenticationDeniedError) {
      res.status(HttpStatusCode.Forbidden).json({
        message: `Authentication failed: ${error.message}`,
        stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack,
      })
    } else if (error instanceof AuthorizationDeniedError) {
      res.status(HttpStatusCode.Unauthorized).json({
        message: `Unauthorized: ${error.message}`,
        stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack,
      })
    } else if (isInstanceOfAny(error, JWTSignatureError, JWTDecodingError, FileReadError, CacheError)) {
      winston.error("Internal caching error", error.message);
      res.status(HttpStatusCode.InternalServerError).json({
        message: "Internal Server Error. Try again a few minutes later",
        stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack,
      })
    }
  }

  next();
};