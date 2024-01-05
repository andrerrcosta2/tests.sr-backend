// import { afterEach, beforeAll, describe, expect, it } from '@jest/globals';
// import { HttpStatusCode } from 'axios';
// import request from 'supertest';
// import { container } from 'tsyringe';
// import { app } from "../../../src/app";
// import { WalletController } from '../../../src/controller/wallet.controller';
// import { WalletRedisRepository } from '../../../src/data-access/wallet/adapter/wallet-redis.repository';
// import { WalletCacheKey, WalletEntity } from '../../../src/data-access/wallet/entity/wallet.entity';
// import { CreateWalletRequest } from '../../../src/model/wallet/create-wallet.request';
// import { UserRepository } from '../../../src/repository/user.repository';
// import { WalletRepository } from '../../../src/repository/wallet.repository';
// import { dbg } from '../../../src/util/log/debug.log';
// import { TestUtil } from '../../util/test.util';
// import '../test.setup';
// import { EntitySupplier } from '../../util/entity.supplier';
// import { UserEntity } from '../../../src/data-access/user/entity/user.entity';

// const util: TestUtil = container.resolve('test-util');
// const userRepository: UserRepository = container.resolve('user-repository');
// const walletRepository: WalletRepository = container.resolve('wallet-repository');
// const walletCacheRepository: WalletRedisRepository = container.resolve('wallet-cache-repository');

// const userEntities: UserEntity[] = [];
// const walletEntities: WalletEntity[] = [];


// beforeAll(async () => {
//     await util.syncTables();
//     userEntities.push(...EntitySupplier.users(1000));
//     walletEntities.push(...EntitySupplier.wallets(1000, userEntities.map(user => user.id)));
//     UserEntity.bulkCreate(userEntities);
//     WalletEntity.bulkCreate(walletEntities);
// });

// afterEach(async () => {
//     await util.truncateTables();
//     await util.truncateCacheTables();
// });

// describe('WalletController', () => {

//     it('performance test for wallet transactions', async () => {

//         const newWallet: CreateWalletRequest = {
//             userId: "non-existing-user",
//             balance: 10000.0,
//             walletName: "wallet-test"
//         };

//         const cookies = await util.createAuthentication();
//         const authCookies = Array.isArray(cookies) ? cookies : [cookies];

//         dbg("Cookie", authCookies);

//         const response = await request(app)
//             .post(WalletController.create)
//             .send(newWallet)
//             .set('Cookie', authCookies || [])
//             .expect(HttpStatusCode.BadRequest);

//         console.log(response.status);
//         console.log(response.headers);
//         console.log(response.body);

//         const cachedWallet: WalletEntity | null = await walletCacheRepository.findById(WalletCacheKey(newWallet.userId, newWallet.walletName));

//         expect(cachedWallet).toBeNull();

//     });

// });