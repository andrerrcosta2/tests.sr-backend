import { Response } from "express";
import { inject, injectable } from "tsyringe";
import { UserEntity } from "../../data-access/user/entity/user.entity";
import { AuthHelper } from "../../helper/auth.helper";
import { DiscoverableError } from "../../model/error/discoverable.error";
import { LoginRequest } from "../../model/user/login.request";
import { ApplicationSecurityError } from "../../shared/security/security-error";
import { AuthService } from "../auth.service";

@injectable()
export class AuthServiceImpl implements AuthService {

    private authHelper: AuthHelper;

    constructor(
        @inject('auth-helper') authHelper: AuthHelper) {
        this.authHelper = authHelper;
    }

    public async login(response: Response, login: LoginRequest): Promise<void> {
        try {
            const user: UserEntity = await this.authHelper.validateCredentials(login.email, login.password);
            const token: string = this.authHelper.generateToken(user);
            this.authHelper.attachCookieToResponse(token, response);
        } catch (error: unknown) {
            if (error instanceof ApplicationSecurityError) {
                throw error;
            }
            throw new DiscoverableError(error, "login error");
        }
    }
}