import { afterEach, beforeAll, describe, expect, it } from "@jest/globals";
import { HttpStatusCode } from "axios";
import { JwtPayload } from "jsonwebtoken";
import request from 'supertest';
import { container } from "tsyringe";
import { JWTSignatureAdapter } from "../../src/_cfg/adapter/jwt-signature.adapter";
import { app } from "../../src/app";
import { AuthController } from "../../src/controller/auth.controller";
import { UserEntity } from "../../src/data-access/user/entity/user.entity";
import { LoginRequest } from "../../src/model/user/login.request";
import { CacheRepository } from "../../src/repository/cache.repository";
import { UserService } from "../../src/service/user.service";
import { JwtHandler } from "../../src/shared/security/jwt/jwt.handler";
import { dbg } from "../../src/util/log/debug.log";
import '../test.setup';
import { TestUtil } from "../util/test.util";


const util: TestUtil = container.resolve('test-util');
const userService: UserService = container.resolve('user-service');
const userCacheRepository: CacheRepository<UserEntity> = container.resolve('user-cache-repository');
const jwtHandler: JwtHandler = container.resolve('jwt-handler');


beforeAll(async () => {
    await util.syncTables();
    await util.truncateCacheTables();
});

afterEach(async () => {
    await util.truncateTables();
});

describe('UserController', () => {
    it('shouldn\'t login with a non existing user', async () => {
        const login: LoginRequest
            = {
            email: 'test@example.com',
            password: 'testpassword'
        };

        const response = await request(app)
            .post(AuthController.login)
            .send(login)
            .expect(HttpStatusCode.Forbidden)

        dbg(response.status);
        dbg(response.body);

        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toEqual('Authentication failed: wrong username or password');

    }),

        it('shouldn\'t login with an existing user but wrong password', async () => {

            await userService.createUser({
                email: "test@example.com",
                name: "testuser",
                password: "123456"
            });

            const login: LoginRequest
                = {
                email: 'test@example.com',
                password: 'testpassword'
            };

            const response = await request(app)
                .post(AuthController.login)
                .send(login)
                .expect(HttpStatusCode.Forbidden)

            dbg(response.status);
            dbg(response.body);

            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toEqual('Authentication failed: wrong username or password');

        });

    it('should login with an existing user with correct password and should exist on cache', async () => {

        await userService.createUser({
            email: "test2@example.com",
            name: "testuser2",
            password: "testpassword"
        });

        const login: LoginRequest
            = {
            email: 'test2@example.com',
            password: 'testpassword'
        };

        const response = await request(app)
            .post(AuthController.login)
            .send(login)
            .expect(HttpStatusCode.Ok)

        const cookies = response.headers['set-cookie'];

        dbg(cookies[0]);
        dbg(response.status);
        dbg(response.body);

        if (cookies && cookies.length === 0) throw new Error('Session cookie not found in the response');

        const token = util.extractTokenFromCookieString(cookies[0], "session=");
        const signatureAdapter: JWTSignatureAdapter = container.resolve('jwt-signature-adapter');

        const payload = jwtHandler.verifyToken(token, signatureAdapter.buildJwtSignatureProperties()) as JwtPayload;

        expect(payload.sub).toEqual(login.email);

        const cached = await userCacheRepository.findById(login.email);

        expect(cached).toHaveProperty('id');
        expect(cached).toHaveProperty('email');
        expect(cached?.email).toEqual(login.email);

        // expect(response.body).toHaveProperty('message');
        // expect(response.body.message).toEqual('Authentication failed: wrong username or password');

    });
});