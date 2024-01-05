import { Transaction } from 'sequelize';
import { injectable } from 'tsyringe';
import { UserRepository } from '../../../repository/user.repository';
import { UserEntity } from '../entity/user.entity';

@injectable()
export class UserSequelizeRepository implements UserRepository {

  public async save(user: UserEntity, transaction?: Transaction): Promise<UserEntity> {
    return await user.save({ transaction: transaction });
  }

  public async findById(id: string, transaction?: Transaction): Promise<UserEntity | null> {
    return await UserEntity.findByPk(id, { transaction });
  }

  public async findByEmail(email: string, transaction?: Transaction): Promise<UserEntity | null> {
    return await UserEntity.findOne({ where: { email }, transaction })
  }
}