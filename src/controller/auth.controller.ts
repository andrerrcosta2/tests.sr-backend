import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { AuthService } from "../service/auth.service";

@injectable()
export class AuthController {

    private service: AuthService;

    constructor(@inject("auth-service") service: AuthService) {
        this.service = service;
    }

    /**
    * @swagger
    * /api/auth/login:
    *   post:
    *     summary: Login an existing user.
    *     description: Endpoint to login.
    *     tags:
    *       - User
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             $ref: '#/components/schemas/LoginRequest'
    *     responses:
    *       200:
    *         description: Successfully logged.
    *       403:
    *         description: Forbidden.
    *
    * components:
    *   schemas:
    *     LoginRequest:
    *       type: object
    *       required:
    *         - email
    *         - password
    *       properties:
    *         email:
    *           type: string
    *           description: User email.
    *         password:
    *           type: string
    *           description: user password.
    */
    public async login(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await this.service.login(res, req.body);
            res.status(200).json(result);
        } catch (error: unknown) {
            next(error);
        }
    }

    public static login: string = '/api/auth/login';

}