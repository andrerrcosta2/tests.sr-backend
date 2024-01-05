import { HttpStatusCode } from "axios";
import { Redis } from "ioredis";
import { Sequelize, Transaction } from "sequelize";
import request from 'supertest';
import { inject, singleton } from "tsyringe";
import { RedisConfig } from "../../src/_cfg/cache.config";
import { SequelizeConfig } from "../../src/_cfg/sequelize.config";
import { app } from "../../src/app";
import { AuthController } from "../../src/controller/auth.controller";
import { LoginRequest } from "../../src/model/user/login.request";
import { UserService } from "../../src/service/user.service";

@singleton()
export class TestUtil {

  private sequelize: Sequelize;
  private redisClient: Redis;
  private userService: UserService;

  constructor(@inject("sequelize-config") sequelizeConfig: SequelizeConfig,
    @inject('redis-config') redisConfig: RedisConfig,
    @inject('user-service') userService: UserService) {
    this.sequelize = sequelizeConfig.getOrm();
    this.redisClient = redisConfig.getClient();
    this.userService = userService;
  }

  public async syncTables(): Promise<void> {
    await this.sequelize.sync({ force: true })
      .then(() => {
        console.log('Database & tables created!');
      });
  }

  public async truncateTables(): Promise<void> {
    await this.sequelize.transaction(async (t: Transaction) => {
      await this.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', { transaction: t });
      await this.sequelize.truncate({ cascade: true, transaction: t });
      await this.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', { transaction: t });

    });
  }

  public get orm(): Sequelize {
    return this.sequelize;
  }

  public extractTokenFromCookieString(cookie: string, cookieName: string): string {
    const tokenStartIndex = cookie.indexOf(cookieName) + cookieName.length;
    const tokenEndIndex = cookie.indexOf(';', tokenStartIndex);
    return cookie.substring(tokenStartIndex, tokenEndIndex !== -1 ? tokenEndIndex : undefined);
  }

  public async truncateCacheTables(): Promise<void> {
    this.redisClient.flushall((err, result) => {
      if (err) {
        console.error('Error flushing all databases:', err);
      } else {
        console.log('All databases flushed:', result);
      }
    });
  }

  public async createAuthentication(): Promise<string | string[]> {
    await this.userService.createUser({
      email: "userfortest@example.com",
      name: "userfortest",
      password: "testpassword"
    });

    const login: LoginRequest = {
      email: 'userfortest@example.com',
      password: 'testpassword'
    };

    const response = await request(app)
      .post(AuthController.login)
      .send(login)
      .expect(HttpStatusCode.Ok)

    const cookies: string | string[] = response.headers['set-cookie'];

    return cookies;

  }
}