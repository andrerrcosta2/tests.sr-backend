import { AllowNull, Column, CreatedAt, DataType, Default, HasMany, Model, PrimaryKey, Table, Unique, UpdatedAt } from 'sequelize-typescript';
import { v4 as UUIDV4 } from 'uuid';
import { ModelError } from '../../../model/error/model.error';
import { WalletEntity } from '../../wallet/entity/wallet.entity';

@Table({
    tableName: "users",
    timestamps: true
})
export class UserEntity extends Model<UserEntity> {

    @Default(0)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    version!: number;

    @PrimaryKey
    @Default(UUIDV4)
    @Column(DataType.UUID)
    id!: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    name!: string;

    @Unique
    @AllowNull(false)
    @Column(DataType.STRING)
    email!: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    password!: string;

    @HasMany(() => WalletEntity)
    wallets!: WalletEntity[];

    @CreatedAt
    @Column(DataType.DATE)
    createdAt!: Date;

    @UpdatedAt
    @Column(DataType.DATE)
    updatedAt!: Date;

    static builder(): UserEntityBuilder {
        return new UserEntityBuilder();
    }
}

export class UserEntityBuilder {
    private user: Partial<UserEntity> = {};

    withVersion(version: number): UserEntityBuilder {
        this.user.version = version;
        return this;
    }

    withId(id: string): UserEntityBuilder {
        this.user.id = id;
        return this;
    }

    withName(name: string): UserEntityBuilder {
        this.user.name = name;
        return this;
    }

    withEmail(email: string): UserEntityBuilder {
        this.user.email = email;
        return this;
    }

    withPassword(password: string): UserEntityBuilder {
        this.user.password = password;
        return this;
    }

    build(): UserEntity {

        if (typeof this.user.name !== 'string') {
            throw new ModelError('NAME must be provided');
        }

        if (typeof this.user.email !== 'string') {
            throw new ModelError('EMAIL must be provided');
        }

        if (typeof this.user.password !== 'string') {
            throw new ModelError('PASSWORD must be provided');
        }

        const user = new UserEntity();
        user.version = this.user.version || 0;
        user.id = this.user.id || UUIDV4();
        user.name = this.user.name;
        user.email = this.user.email;
        user.password = this.user.password;

        return user;
    }
}

export const UserCacheKey = (email: string) => {
    return `user:${email}`;
  }