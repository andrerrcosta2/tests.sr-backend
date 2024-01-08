import Redis, { Redis as RedisInstance } from 'ioredis';
import { singleton } from 'tsyringe';
// import { logger } from './logger.config';


import { appProperties } from './environment.config';
import { winston } from './logger.config';


@singleton()
export class RedisConfig {
    private redisClient: RedisInstance | null = null;

    public getClient(): RedisInstance {
        if (!this.redisClient) {
            // if (isTest) {
            //     this.redisClient = new redisMock();
            // } else {
            const url: string = `redis://${appProperties.cache?.host}:${appProperties.cache?.port}`;
            this.redisClient = new Redis(url) as RedisInstance;
            // }

            this.redisClient.on('connect', () => {
                winston.info("connected to redis");
            });

            this.redisClient.on('error', (error: Error) => {
                winston.serverError("redis client error", error.message, error.stack);
            });

            this.redisClient.on('end', () => {
                winston.info("redis client disconnected");
            });
        }
        return this.redisClient;
    }
}