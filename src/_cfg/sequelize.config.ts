
import { Dialect, Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { inject, injectable } from 'tsyringe';
import { DatabaseProperties } from './properties/database.properties';
import { DatabaseConfig } from './database.config';
import { UserEntity } from '../data-access/user/entity/user.entity';
import { WalletEntity } from '../data-access/wallet/entity/wallet.entity';
import { isStaging, isTest } from './environment.config';

@injectable()
export class SequelizeConfig {

  private properties: DatabaseProperties;
  private orm: Sequelize;

  constructor(@inject('database-config') databaseConfig: DatabaseConfig) {
    this.properties = databaseConfig.getProperties();

    if (isTest || isStaging) {
      this.orm = new Sequelize({
        dialect: 'sqlite',
        storage: ':memory:',
        logging: this.properties.logging,
        define: this.properties.def,
        models: [UserEntity, WalletEntity],
        logQueryParameters: true,
        transactionType: Transaction.TYPES.DEFERRED
      });
    } else {
      this.orm = new Sequelize({
        database: this.properties.database,
        username: this.properties.user,
        password: this.properties.password,
        host: this.properties.host,
        port: Number(this.properties.port),
        // dialect: this.getSequelizeDialect(this.properties.dialect || "mysql"),
        dialect: "mysql",
        logging: this.properties.logging,
        pool: this.properties.pool,
        define: this.properties.def,
        models: [UserEntity, WalletEntity],
        logQueryParameters: true,
        transactionType: Transaction.TYPES.DEFERRED
      });
    }
  }

  public getOrm(): Sequelize {
    this.orm.addModels([UserEntity, WalletEntity]);
    return this.orm;
  }

  private getSequelizeDialect(dialect: string): Dialect {
    const supportedDialects: Dialect[] = ['mysql', 'postgres', 'sqlite', 'mariadb', 'mssql', 'db2', 'snowflake', 'oracle'];

    if (supportedDialects.includes(dialect as Dialect)) {
      return dialect as Dialect;
    } else {
      throw new Error(`Unsupported Sequelize dialect: ${dialect}`);
    }
  }

}