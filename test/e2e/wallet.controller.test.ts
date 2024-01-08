import { afterEach, beforeAll, describe, expect, it } from '@jest/globals';
import { HttpStatusCode } from 'axios';
import request from 'supertest';
import { container } from 'tsyringe';
import { v4 as uuidv4 } from 'uuid';
import { app } from "../../src/app";
import { WalletController } from '../../src/controller/wallet.controller';
import { UserEntity } from '../../src/data-access/user/entity/user.entity';
import { WalletRedisRepository } from '../../src/data-access/wallet/adapter/wallet-redis.repository';
import { WalletCacheKey, WalletEntity } from '../../src/data-access/wallet/entity/wallet.entity';
import { AddToWalletRequest } from '../../src/model/wallet/add-to-wallet.request';
import { CreateWalletRequest } from '../../src/model/wallet/create-wallet.request';
import { SubFromWalletRequest } from '../../src/model/wallet/sub-from-wallet.request';
import { UserRepository } from '../../src/repository/user.repository';
import { WalletRepository } from '../../src/repository/wallet.repository';
import { dbg } from '../../src/util/log/debug.log';
import { Terminal } from '../../src/util/log/terminal.log';
import '../test.setup';
import { TestUtil } from '../util/test.util';

const util: TestUtil = container.resolve('test-util');
const userRepository: UserRepository = container.resolve('user-repository');
const walletRepository: WalletRepository = container.resolve('wallet-repository');
const walletCacheRepository: WalletRedisRepository = container.resolve('wallet-cache-repository');



beforeAll(async () => {
    await util.syncTables();
});

afterEach(async () => {
    await util.truncateTables();
    await util.truncateCacheTables();
});

describe('wallet.controller.test', () => {

    it('shouldn\'t create a wallet with a non existing user and shoudn\'t be found in cache', async () => {

        Terminal.title('shouldn\'t create a wallet with a non existing user and shoudn\'t be found in cache', 'start');

        const newWallet: CreateWalletRequest = {
            userId: "non-existing-user",
            balance: 10000.0,
            walletName: "wallet-test"
        };

        dbg("CreateAuthentication")

        const cookies = await util.createAuthentication();

        dbg("After Authentication")
        const authCookies = Array.isArray(cookies) ? cookies : [cookies];

        dbg("Cookie", authCookies);

        const response = await request(app)
            .post(WalletController.create)
            .send(newWallet)
            .set('Cookie', authCookies || [])
            .expect(HttpStatusCode.BadRequest);

        console.log(response.status);
        console.log(response.headers);
        console.log(response.body);

        const cachedWallet: WalletEntity | null = await walletCacheRepository.findById(WalletCacheKey(newWallet.userId, newWallet.walletName));

        expect(cachedWallet).toBeNull();

        Terminal.title('shouldn\'t create a wallet with a non existing user and shoudn\'t be found in cache', 'end');

    });

    it('should create a wallet with an existing user and be found in cache', async () => {

        Terminal.title('should create a wallet with an existing user and be found in cache', 'start');

        /**
         * The user won't be found in cache because we are using its repository
         * instead the service layer
         */
        const userEntity: UserEntity = await userRepository.save(UserEntity.builder()
            .withId(uuidv4())
            .withEmail("test1@example.com")
            .withName("user-test1")
            .withPassword("123456")
            .build());


        const newWallet: CreateWalletRequest = {
            userId: userEntity.id,
            balance: 10000.0,
            walletName: "wallet-test"
        };

        const cookies = await util.createAuthentication();
        const authCookies = Array.isArray(cookies) ? cookies : [cookies];

        dbg("Cookie", authCookies);

        const response = await request(app)
            .post(WalletController.create)
            .send(newWallet)
            .set('Cookie', authCookies || [])
            .expect(HttpStatusCode.Created);

        console.log(response.status);
        console.log(response.body);

        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('userId');

        const cachedWallet: WalletEntity | null = await walletCacheRepository.findById(WalletCacheKey(response.body.userId, newWallet.walletName));

        expect(cachedWallet).toHaveProperty("id");
        expect(cachedWallet?.balance).toEqual(newWallet.balance);

        Terminal.title('should create a wallet with an existing user and be found in cache', 'end');

    });

    it('should increase balance on wallet and be found in cache', async () => {

        Terminal.title('should increase balance on wallet and be found in cache', 'start');
        /**
         * The user won't be found in cache because we are using its repository
         * instead the service layer for brevity
         */
        const userEntity: UserEntity = await userRepository.save(UserEntity.builder()
            .withId(uuidv4())
            .withEmail("test1@example.com")
            .withName("user-test1")
            .withPassword("123456")
            .build());

        const walletEntity: WalletEntity = await walletRepository.save(WalletEntity.builder()
            .withId(uuidv4())
            .withUserId(userEntity.id)
            .withBalance(10000.0)
            .withWalletName("wallet-test1")
            .build())

        const increase: AddToWalletRequest = {
            userId: walletEntity!.userId,
            walletName: walletEntity!.walletName,
            balance: 7800.0
        };

        const cookies = await util.createAuthentication();
        const authCookies = Array.isArray(cookies) ? cookies : [cookies];

        dbg("Cookie", authCookies);

        const response = await request(app)
            .post(WalletController.addBalance)
            .set('Cookie', authCookies || [])
            .send(increase)


        console.log(response.status);
        console.log(response.body);

        expect(HttpStatusCode.Ok);
        expect(response.body).toHaveProperty("message");
        expect(response.body).toHaveProperty("updatedBalance");
        expect(response.body.message).toEqual("Operation successful");
        expect(response.body.updatedBalance).toEqual(walletEntity.balance + increase.balance);

        const cachedWallet: WalletEntity | null = await walletCacheRepository.findById(WalletCacheKey(walletEntity.userId, walletEntity.walletName));

        expect(cachedWallet).toHaveProperty("id");
        expect(cachedWallet?.balance).toEqual(response.body.updatedBalance);

        Terminal.title('should increase balance on wallet and be found in cache', 'end');

    });

    it('shouldn\'t decreasing more than the wallet limit and should not be found in cache', async () => {

        Terminal.title('shouldn\'t decreasing more than the wallet limit and should not be found in cache', 'start');
        /**
         * The user won't be found in cache because we are using its repository
         * instead the service layer
         */
        const userEntity: UserEntity = await userRepository.save(UserEntity.builder()
            .withId(uuidv4())
            .withEmail("test1@example.com")
            .withName("user-test1")
            .withPassword("123456")
            .build());

        const walletEntity: WalletEntity = await walletRepository.save(WalletEntity.builder()
            .withId(uuidv4())
            .withUserId(userEntity.id)
            .withBalance(10000.0)
            .withWalletName("wallet-test1")
            .build())

        const subtract: SubFromWalletRequest = {
            userId: walletEntity!.userId,
            walletName: walletEntity!.walletName,
            balance: 10001.0
        };


        const cookies = await util.createAuthentication();
        const authCookies = Array.isArray(cookies) ? cookies : [cookies];

        dbg("Cookie", authCookies);

        const response = await request(app)
            .post(WalletController.subtractBalance)
            .set('Cookie', authCookies || [])
            .send(subtract)


        console.log(response.status);
        console.log(response.body);

        expect(HttpStatusCode.BadRequest);
        expect(response.body).toHaveProperty("message");
        expect(response.body.message).toEqual("Bad Request: Insufficient funds");

        const cachedWallet: WalletEntity | null = await walletCacheRepository.findById(WalletCacheKey(walletEntity.userId, walletEntity.walletName));

        expect(cachedWallet).toBeNull();

        Terminal.title('shouldn\'t decreasing more than the wallet limit and should not be found in cache', 'end');

    });

    it('should decrease value less the wallet limit and be found in cache', async () => {

        Terminal.title('should decrease value less the wallet limit and be found in cache', 'start');

        const allWallets: WalletEntity[] = await WalletEntity.findAll();

        dbg("All Wallets", allWallets);

        const userEntity: UserEntity = await userRepository.save(UserEntity.builder()
            .withId(uuidv4())
            .withEmail("test1@example.com")
            .withName("user-test1")
            .withPassword("123456")
            .build());

        const walletEntity: WalletEntity = await walletRepository.save(WalletEntity.builder()
            .withId(uuidv4())
            .withUserId(userEntity.id)
            .withBalance(10000.0)
            .withWalletName("wallet-test1")
            .build())

        const subtract: SubFromWalletRequest = {
            userId: walletEntity!.userId,
            walletName: walletEntity!.walletName,
            balance: 9999.0
        };

        const cookies = await util.createAuthentication();
        const authCookies = Array.isArray(cookies) ? cookies : [cookies];

        dbg("Cookie", authCookies);

        const response = await request(app)
            .post(WalletController.subtractBalance)
            .set('Cookie', authCookies || [])
            .send(subtract)


        console.log(response.status);
        console.log(response.body);

        expect(HttpStatusCode.Ok);
        expect(response.body).toHaveProperty("message");
        expect(response.body).toHaveProperty("updatedBalance");
        expect(response.body.message).toEqual("Operation successful");
        expect(response.body.updatedBalance).toEqual(walletEntity.balance - subtract.balance);

        const cachedWallet: WalletEntity | null = await walletCacheRepository.findById(WalletCacheKey(walletEntity.userId, walletEntity.walletName));

        expect(cachedWallet).toHaveProperty("id");
        expect(cachedWallet?.balance).toEqual(response.body.updatedBalance);

        Terminal.title('should decrease value less the wallet limit and be found in cache', 'end');

    });
});