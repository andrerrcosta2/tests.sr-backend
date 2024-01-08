'use strict';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { v4: uuidv4 } = require('uuid');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { UserEntity } = require('../src/data-access/user/entity/user.entity'); 
// eslint-disable-next-line @typescript-eslint/no-var-requires

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    const users = [];
    const wallets = [];

    for (let i = 0; i < 1000; i++) {
      users.push({
        id: uuidv4(),
        email: `test${i}@email.com`,
        name: `testuser${i}`,
        password: `testpassword${i}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await queryInterface.bulkInsert('users', users, {});

    const userRecords = await UserEntity.findAll({ limit: 1000 });
    for (let i = 0; i < 1000; i++) {
      wallets.push({
        id: uuidv4(),
        userId: userRecords[i].id,
        walletName: `testwallet${i}`,
        balance: Math.floor(Math.random() * (100000 - 1000 + 1)) + 1000,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await queryInterface.bulkInsert('wallets', wallets, {});
  },

  async down (queryInterface) {
    await queryInterface.bulkDelete('wallets', null, {});
    await queryInterface.bulkDelete('users', null, {});
  }
};
