
import { Redis } from 'ioredis';
import { inject, injectable } from 'tsyringe';
import { RedisConfig } from '../../../_cfg/cache.config';
import { CacheError } from '../../../model/error/cache.error';
import { CacheRepository } from '../../../repository/cache.repository';
import { UserCacheKey, UserEntity } from '../entity/user.entity';

@injectable()
export class UserRedisRepository implements CacheRepository<UserEntity> {

    private readonly EXPIRATION_TIME_IN_SECONDS: number;
    private redisClient: Redis;

    constructor(
        @inject('redis-config') redisConfig: RedisConfig
    ) {
        this.redisClient = redisConfig.getClient();
        this.EXPIRATION_TIME_IN_SECONDS = Number(process.env.CACHE_EXPIRATION_IN_SECONDS);
    }

    /**
     * Cache the user entity in Redis.
     * @param UserEntity The user entity to cache.
     */
    public async save(entity: UserEntity): Promise<void> {
        const cacheKey = UserCacheKey(entity.email);
        const jsonUser = JSON.stringify(entity);
        try {
            await this.redisClient.set(cacheKey, jsonUser, 'EX', this.EXPIRATION_TIME_IN_SECONDS);
        } catch (error) {
            throw new CacheError(`Error trying to cache user ${cacheKey}: ${error instanceof Error ? error.message : error}`);
        }
    }

    /**
     * Retrieve the user entity from Redis cache.
     * @param email The email of the user entity to retrieve.
     * @returns The yser entity if found, otherwise null.
     */
    public async findById(email: string): Promise<UserEntity | null> {
        const cacheKey = UserCacheKey(email);
        const cachedUser = await this.redisClient.get(cacheKey);
        if (cachedUser) {
            return JSON.parse(cachedUser) as UserEntity;
        }
        return null;
    }
}