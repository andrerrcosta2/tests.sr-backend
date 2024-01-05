import { HttpStatusCode } from 'axios';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { winston } from '../_cfg/logger.config';
import WalletService from '../service/wallet.service';

@injectable()
export class WalletController {

    private service: WalletService;

    constructor(@inject("wallet-service") service: WalletService) {
        this.service = service;
    }

    /**
    * @swagger
    * /api/wallet/create:
    *   post:
    *     summary: Create a new wallet.
    *     description: Endpoint to create a new wallet.
    *     tags:
    *       - Wallet
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             $ref: '#/components/schemas/CreateWalletRequest'
    *     responses:
    *       200:
    *         description: Successfully created a new wallet.
    *       401:
    *         description: Unauthorized.
    *
    * components:
    *   schemas:
    *     CreateWalletRequest:
    *       type: object
    *       required:
    *         - userId
    *         - walletName
    *         - balance
    *       properties:
    *         userId:
    *           type: string
    *           description: The ID of the user associated with the wallet.
    *         walletName:
    *           type: string
    *           description: The name of the wallet.
    *         balance:
    *           type: number
    *           description: The initial balance of the wallet.
    */
    public async create(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await this.service.createWallet(req.body);
            res.status(HttpStatusCode.Created).json(result);
        } catch (error: any) {
            winston.info(`${typeof error} error creating a new wallet`);
            next(error);
        }
    };

    /**
    * @swagger
    * /api/wallet/add:
    *   post:
    *     summary: increases the balance of a wallet.
    *     description: Endpoint to add balance to an existing wallet.
    *     tags:
    *       - Wallet
    *     security:
    *       - jwtAuth: []
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             $ref: '#/components/schemas/AddToWalletRequest'
    *     responses:
    *       200:
    *         description: Successfully created a new wallet.
    *       401:
    *         description: Unauthorized.
    * components:
    *   schemas:
    *     AddToWalletRequest:
    *       type: object
    *       required:
    *         - userId
    *         - walletName
    *         - balance
    *       properties:
    *         userId:
    *           type: string
    *           description: The ID of the user associated with the wallet.
    *         walletName:
    *           type: string
    *           description: The name of the wallet.
    *         balance:
    *           type: number
    *           description: The amout to increase to the wallet.
    */
    public async addBalance(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await this.service.addBalanceToWallet(req.body);
            res.status(HttpStatusCode.Ok).json(result);
        } catch (error: any) {
            winston.info(`${typeof error} error increasing a wallet balance`);
            next(error);
        }
    };

    /**
    * @swagger
    * /api/wallet/subtract:
    *   post:
    *     summary: subtracts the balance of a wallet.
    *     description: Endpoint to subtract balance from an existing wallet.
    *     tags:
    *       - Wallet
    *     security:
    *       - jwtAuth: []
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             $ref: '#/components/schemas/SubFromWalletRequest'
    *     responses:
    *       200:
    *         description: Successfully added to wallet.
    *       401:
    *         description: Unauthorized.
    * components:
    *   schemas:
    *     SubFromWalletRequest:
    *       type: object
    *       required:
    *         - userId
    *         - walletName
    *         - balance
    *       properties:
    *         userId:
    *           type: string
    *           description: The ID of the user associated with the wallet.
    *         walletName:
    *           type: string
    *           description: The name of the wallet.
    *         balance:
    *           type: number
    *           description: The amount to subtranct from the wallet.
    */
    public async subtractBalance(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await this.service.subtractBalanceFromWallet(req.body);
            res.status(HttpStatusCode.Ok).json(result);
        } catch (error: any) {
            winston.info(`${typeof error} error subtracting a wallet balance`);
            next(error);
        }
    };

    public static create: string = "/api/wallet/create";
    public static addBalance: string = "/api/wallet/add";
    public static subtractBalance: string = "/api/wallet/subtract";

}