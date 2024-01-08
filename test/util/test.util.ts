import { HttpStatusCode } from "axios";
import { Redis } from "ioredis";
import { Sequelize, Transaction } from "sequelize";
import request from 'supertest';
import { inject, singleton } from "tsyringe";
import { RedisConfig } from "../../src/_cfg/cache.config";
import { isDevelopment, isProduction } from "../../src/_cfg/environment.config";
import { SequelizeConfig } from "../../src/_cfg/sequelize.config";
import { app } from "../../src/app";
import { AuthController } from "../../src/controller/auth.controller";
import { LoginRequest } from "../../src/model/user/login.request";
import { UserService } from "../../src/service/user.service";
import { dbg } from "../../src/util/log/debug.log";
import { TestError } from "../error/test.error";

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
    try {
      await this.sequelize.sync({ force: true });
      dbg('Tables created successfully');
    } catch (error: unknown) {
      throw new TestError("Error creating tables: " + (error instanceof Error ? error.message : error as string));
    }
  }

  public async truncateTables(): Promise<void> {
    try {
      await this.sequelize.transaction(async (t: Transaction) => {
        if (isDevelopment || isProduction) await this.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', { transaction: t });
        await this.sequelize.truncate({ cascade: true });
        if (isDevelopment || isProduction) await this.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', { transaction: t });
      });

    } catch (error: unknown) {
      dbg("Error truncating tables", error);
    }
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