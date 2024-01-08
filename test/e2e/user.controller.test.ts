import { afterEach, beforeAll, describe, expect, it } from '@jest/globals';
import { HttpStatusCode } from 'axios';
import request from 'supertest';
import { container } from 'tsyringe';
import { app } from "../../src/app";
import { UserController } from '../../src/controller/user.controller';
import { UserEntity } from '../../src/data-access/user/entity/user.entity';
import { CreateUserRequest } from '../../src/model/user/create-user.request';
import { CacheRepository } from '../../src/repository/cache.repository';
import { dbg } from '../../src/util/log/debug.log';
import '../test.setup';
import { TestUtil } from '../util/test.util';

const util: TestUtil = container.resolve('test-util');
const userCacheRepository: CacheRepository<UserEntity> = container.resolve('user-cache-repository');

beforeAll(async () => {
    await util.syncTables();
});

afterEach(async () => {
    await util.truncateTables();
    await util.truncateCacheTables();
});

describe('user.controller.test', () => {
    it('should create a new user and should be found in cache', async () => {
        const newUser: CreateUserRequest
            = {
            email: 'test@example.com',
            name: 'Test User',
            password: 'testpassword'
        };

        const response = await request(app)
            .post(UserController.create)
            .send(newUser)
            .expect(HttpStatusCode.Created)

        dbg(response.status);
        dbg(response.body);

        expect(response.body).toHaveProperty('id');

        const cached: UserEntity | null = await userCacheRepository.findById(newUser.email);


        expect(cached?.id).toEqual(response.body.id);
    });
});