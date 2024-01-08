import { inject, injectable } from "tsyringe";
import { winston } from "../_cfg/logger.config";
import { UserCacheKey, UserEntity } from "../data-access/user/entity/user.entity";
import { CacheError } from "../model/error/cache.error";
import { CacheRepository } from "../repository/cache.repository";
import { UserRepository } from "../repository/user.repository";

@injectable()
export class UserDetailsHelper {

    private userCacheRepository: CacheRepository<UserEntity>;
    private userRepository: UserRepository;

    constructor(@inject("user-repository") userRepository: UserRepository,
        @inject('user-cache-repository') userCacheRepository: CacheRepository<UserEntity>) {
        this.userCacheRepository = userCacheRepository;
        this.userRepository = userRepository;
    }

    public async findByUsername(username: string): Promise<UserEntity | null> {
        let entity: UserEntity | null = await this.userCacheRepository.findById(UserCacheKey(username));
        if (!entity) {
            entity = await this.userRepository.findByEmail(username);
            try {
                // lets handle that without await but let's log for possible errors
                if (entity) {
                    this.userCacheRepository.save(entity);
                }
            } catch (error: unknown) {
                if (error instanceof CacheError) {
                    winston.error("Some error caching asynchronously", error.message, error.stack);
                }
                winston.unexpected("Unexpected error caching asynchronously", error);
            }
        }

        return entity;
    }
}