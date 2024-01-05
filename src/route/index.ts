import express from "express";
import { inject, injectable } from "tsyringe";
import { AuthController } from "../controller/auth.controller";
import { UserController } from "../controller/user.controller";
import { WalletController } from "../controller/wallet.controller";
import { jwtValidatorMiddleware } from "../middleware/jwt-validator.middleware";

@injectable()
export class RouteConfig {

    constructor(@inject("wallet-controller") private readonly walletController: WalletController,
        @inject("user-controller") private readonly userController: UserController,
        @inject("auth-controller") private readonly authController: AuthController) { }


    public configureRoutes(): express.Router {
        const router = express.Router();

        // Wallet
        router.post('/wallet/create', jwtValidatorMiddleware, this.walletController.create.bind(this.walletController));
        router.post('/wallet/add', jwtValidatorMiddleware, this.walletController.addBalance.bind(this.walletController));
        router.post('/wallet/subtract', jwtValidatorMiddleware, this.walletController.subtractBalance.bind(this.walletController));

        // User
        router.post("/user/register", this.userController.create.bind(this.userController));

        // Login
        router.post("/auth/login", this.authController.login.bind(this.authController));


        return router;
    }
}