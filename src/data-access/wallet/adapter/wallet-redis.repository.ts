import { Redis } from 'ioredis';
import { inject, injectable } from 'tsyringe';
import { RedisConfig } from '../../../_cfg/cache.config';
import { CacheError } from '../../../model/error/cache.error';
import { CacheRepository } from '../../../repository/cache.repository';
import { WalletCacheKey, WalletEntity } from '../entity/wallet.entity';

@injectable()
export class WalletRedisRepository implements CacheRepository<WalletEntity> {

    private readonly EXPIRATION_TIME_IN_SECONDS: number;
    private redisClient: Redis;

    constructor(
        @inject('redis-config') private redisConfig: RedisConfig
    ) {
        this.redisClient = this.redisConfig.getClient();
        this.EXPIRATION_TIME_IN_SECONDS = Number(process.env.CACHE_EXPIRATION_IN_SECONDS);
    }

    /**
     * Cache the wallet entity in Redis.
     * @param walletEntity The wallet entity to cache.
     */
    public async save(entity: WalletEntity): Promise<void> {
        const cacheKey = WalletCacheKey(entity.userId, entity.walletName);
        const cachedWallet = JSON.stringify(entity);
        try {
            await this.redisClient.set(cacheKey, cachedWallet, 'EX', this.EXPIRATION_TIME_IN_SECONDS);
        } catch (error: unknown) {
            throw new CacheError(`Error trying to cache wallet ${cacheKey}: ${error instanceof Error ? error.message : error}`);
        }
    }

    /**
     * Retrieve the wallet entity from Redis cache.
     * @param walletId The ID of the wallet entity to retrieve.
     * @returns The wallet entity if found, otherwise null.
     */
    public async findById(id: string): Promise<WalletEntity | null> {
        const cachedWallet = await this.redisClient.get(id);
        if (cachedWallet) {
            return JSON.parse(cachedWallet) as WalletEntity;
        }
        return null;
    }
}