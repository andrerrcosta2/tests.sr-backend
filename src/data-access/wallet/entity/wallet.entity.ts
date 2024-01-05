import { v4 as UUIDV4 } from 'uuid';
import { UserEntity } from '../../user/entity/user.entity';
import { BelongsTo, Column, Model, CreatedAt, DataType, Default, ForeignKey, PrimaryKey, Table, UpdatedAt, AllowNull } from 'sequelize-typescript';
import { ModelError } from '../../../model/error/model.error';

@Table({
  tableName: 'wallets',
  timestamps: true,
})
export class WalletEntity extends Model<WalletEntity> {

  @PrimaryKey
  @Default(UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => UserEntity)
  @Column(DataType.UUID)
  userId!: string;

  @BelongsTo(() => UserEntity)
  user!: UserEntity;

  @Column(DataType.FLOAT)
  balance!: number;

  @Column(DataType.STRING)
  walletName!: string;

  @Default(0)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  version!: number;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt!: Date;

  static builder(): WalletEntityBuilder {
    return new WalletEntityBuilder();
  }
}

export class WalletEntityBuilder {
  private wallet: Partial<WalletEntity> = {};

  constructor() {
    this.wallet = new WalletEntity();
  }

  withId(id: string): WalletEntityBuilder {
    this.wallet.id = id;
    return this;
  }

  withUserId(userId: string): WalletEntityBuilder {
    this.wallet.userId = userId;
    return this;
  }

  withBalance(balance: number): WalletEntityBuilder {
    this.wallet.balance = balance;
    return this;
  }

  withWalletName(walletName: string): WalletEntityBuilder {
    this.wallet.walletName = walletName;
    return this;
  }

  withVersion(version: number): WalletEntityBuilder {
    this.wallet.version = version;
    return this;
  }

  build(): WalletEntity {

    if(typeof this.wallet.userId !== 'string') {
      throw new ModelError('USERID must be provided');
    }

    if(typeof this.wallet.walletName !== 'string') {
      throw new ModelError('walletName must be provided');
    }

    const wallet = new WalletEntity();
    wallet.id = this.wallet.id || UUIDV4();
    wallet.userId = this.wallet.userId;
    wallet.balance = this.wallet.balance || 0.0;
    wallet.walletName = this.wallet.walletName;
    wallet.version = this.wallet.version || 0;

    return wallet;
  }
}

export const WalletCacheKey = (userId: string, walletName: string) => {
  return `wallet:${userId}:${walletName}`;
}
