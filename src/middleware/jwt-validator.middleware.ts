import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { container } from "tsyringe";
import { JWTSignatureAdapter } from "../_cfg/adapter/jwt-signature.adapter";
import { AuthorizationDeniedError } from "../shared/security/authorization-denied.error";
import { JwtHandler } from "../shared/security/jwt/jwt.handler";


export const jwtValidatorMiddleware = (req: Request, res: Response, next: NextFunction) => {

    const token: string = req.cookies.session;

    if (!token) {
        throw new AuthorizationDeniedError("Unauthorized");
    }

    const JwtHandler: JwtHandler = container.resolve("jwt-handler");
    const adapter: JWTSignatureAdapter = container.resolve("jwt-signature-adapter");

    const payload = JwtHandler.verifyToken(token, adapter.buildJwtSignatureProperties()) as JwtPayload;

    // This test became too big. this is how you can handle roles but i won't do that
    // i'm not implementing a session or a refresh token. it would take too long time
    // but as far as i know, the token is verified if the code reached until here;

    next();
}