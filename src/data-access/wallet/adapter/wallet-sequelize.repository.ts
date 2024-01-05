import { Op, Sequelize, Transaction } from "sequelize";
import { injectable } from "tsyringe";
import { EntityNotFoundError } from "../../../model/error/entity-not-found.error";
import { RepositoryError } from "../../../model/error/repository.error";
import { WalletRepository } from "../../../repository/wallet.repository";
import { WalletEntity } from "../entity/wallet.entity";


@injectable()
export class WalletSequelizeRepository implements WalletRepository {

  public async findByUserAndWalletName(userId: string, walletName: string, transaction?: Transaction): Promise<WalletEntity | null> {
    return await WalletEntity.findOne({ where: { userId, walletName }, transaction });
  }

  public async save(entity: WalletEntity, transaction?: Transaction): Promise<WalletEntity> {
    return await entity.save({ transaction });
  }

  public async increaseBalance(userId: string, walletName: string, amount: number, transaction?: Transaction): Promise<WalletEntity | null> {
    const updateResult = await WalletEntity.update(
      { balance: Sequelize.literal(`balance + ${amount}`) }, // Increment balance by amount
      {
        where: { userId, walletName },
        transaction
      });

    if (!updateResult[0] || updateResult[0] === 0) {
      throw new EntityNotFoundError(`Wallet with userId ${userId} and walletName ${walletName} not found.`);
    }

    return updateResult[0] !== 0 ? await this.findByUserAndWalletName(userId, walletName) : null;
  }

  public async decreaseBalance(userId: string, walletName: string, amount: number, transaction?: Transaction): Promise<WalletEntity | null> {
    const updateResult = await WalletEntity.update(
      {
        balance: Sequelize.literal(`CASE 
                                        WHEN balance >= ${amount} THEN balance - ${amount} 
                                        ELSE balance 
                                     END`)
      },
      {
        where: { userId, walletName, balance: { [Op.gte]: amount } },
        transaction,
      }
    );
    if (!updateResult[0] || updateResult[0] === 0) {
      throw new RepositoryError(`Insufficient balance in wallet with userId ${userId} and walletName ${walletName}.`);
    }

    return updateResult[0] !== 0 ? await this.findByUserAndWalletName(userId, walletName) : null;
  }
}