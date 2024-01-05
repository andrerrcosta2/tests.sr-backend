import { HttpStatusCode } from 'axios';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { winston } from '../_cfg/logger.config';
import { UserService } from '../service/user.service';

@injectable()
export class UserController {

    private service: UserService;

    constructor(@inject("user-service") service: UserService) {
        this.service = service;
    }

    /**
    * @swagger
    * /api/user/register:
    *   post:
    *     summary: Create a new user.
    *     description: Endpoint to create a new user.
    *     tags:
    *       - User
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             $ref: '#/components/schemas/CreateUserRequest'
    *     responses:
    *       200:
    *         description: Successfully created a new user.
    *       400:
    *         description: email already exists.
    *
    * components:
    *   schemas:
    *     CreateUserRequest:
    *       type: object
    *       required:
    *         - email
    *         - name
    *         - password
    *       properties:
    *         email:
    *           type: string
    *           description: User email.
    *         name:
    *           type: string
    *           description: The name of the user.
    *         password:
    *           type: string
    *           description: user password.
    */
    public async create(req: Request, res: Response, next: NextFunction) {
        try {
            winston.info("creating new user");
            const result = await this.service.createUser(req.body);
            res.status(HttpStatusCode.Created).json(result);
        } catch (error: any) {
            winston.info(`error creating a new user`, error);
            next(error);
        }
    }

    public static create: string = "/api/user/register";
}