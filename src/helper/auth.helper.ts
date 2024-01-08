import { Response } from "express";
import { inject, injectable } from "tsyringe";
import { JWTClaimsAdapter } from "../_cfg/adapter/jwt-claims.adapter";
import { JWTSignatureAdapter } from "../_cfg/adapter/jwt-signature.adapter";
import { winston } from "../_cfg/logger.config";
import { UserEntity } from "../data-access/user/entity/user.entity";
import { AuthenticationDeniedError } from "../shared/security/authentication-denied.error";
import { JwtHandler } from "../shared/security/jwt/jwt.handler";
import { BCryptUtil } from "../util/cryptography/bcrypt.util";
import { UserDetailsHelper } from "./user-details.helper";

@injectable()
export class AuthHelper {

    private jwtHandler: JwtHandler;
    private signatureAdaper: JWTSignatureAdapter;
    private claimsAdapter: JWTClaimsAdapter;
    private userDetails: UserDetailsHelper;

    constructor(@inject('jwt-handler') jwtHandler: JwtHandler,
        @inject('jwt-signature-adapter') signatureAdaper: JWTSignatureAdapter,
        @inject('jwt-claims-adapter') claimsAdapter: JWTClaimsAdapter,
        @inject("user-details-helper") userDetails: UserDetailsHelper) {
        this.userDetails = userDetails;
        this.jwtHandler = jwtHandler;
        this.signatureAdaper = signatureAdaper;
        this.claimsAdapter = claimsAdapter;
    }

    public async validateCredentials(email: string, password: string): Promise<UserEntity> {
        try {
            const user = await this.userDetails.findByUsername(email);

            if (!user) throw new AuthenticationDeniedError("wrong username or password");

            const isPasswordValid = await BCryptUtil.decrypt(password, user.password);

            if (!isPasswordValid) {
                throw new AuthenticationDeniedError("wrong username or password");
            }

            return user;

        } catch (error) {
            winston.info("Authentication denied", email, error);
            throw error;
        }
    }

    public generateToken(user: UserEntity): string {
        try {
            const payload = this.claimsAdapter.generatePayload(user.email);
            const signatureProperties = this.signatureAdaper.buildJwtSignatureProperties();
            return this.jwtHandler.generateSignedToken(payload, signatureProperties);
        } catch (error: unknown) {
            winston.unexpected("Error on generating token", error);
            throw error;
        }
    }

    public attachCookieToResponse(token: string, response: Response) {
        response.cookie('session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });
    }

    public async hashPassword(password: string): Promise<string> {
        try {
            return BCryptUtil.encrypt(password);
        } catch (error: unknown) {
            winston.info("Error hashing password", (error instanceof Error ? error.message : error));
            throw error;
        }
    }
}