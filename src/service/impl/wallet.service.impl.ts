import { ForeignKeyConstraintError } from "sequelize";
import { inject, injectable } from "tsyringe";
import { winston } from "../../_cfg/logger.config";
import { UserEntity } from "../../data-access/user/entity/user.entity";
import { WalletCacheKey, WalletEntity } from "../../data-access/wallet/entity/wallet.entity";
import { WalletMapper } from "../../data-access/wallet/mapper/wallet.mapper";
import { CacheError } from "../../model/error/cache.error";
import { DiscoverableError } from "../../model/error/discoverable.error";
import { EntityNotFoundError } from "../../model/error/entity-not-found.error";
import { InsuficientBalanceError } from "../../model/error/insuficient-balance.error";
import { RepositoryError } from "../../model/error/repository.error";
import { AddToWalletRequest } from "../../model/wallet/add-to-wallet.request";
import { AddToWalletResponse } from "../../model/wallet/add-to-wallet.response";
import { CreateWalletRequest } from "../../model/wallet/create-wallet.request";
import { CreateWalletResponse } from "../../model/wallet/create-wallet.response";
import { SubFromWalletRequest } from "../../model/wallet/sub-from-wallet.request";
import { SubFromWalletResponse } from "../../model/wallet/sub-from-wallet.response";
import { WalletResponse } from "../../model/wallet/wallet.response";
import { CacheRepository } from "../../repository/cache.repository";
import { UserRepository } from "../../repository/user.repository";
import { WalletRepository } from "../../repository/wallet.repository";
import { transactional } from "../../shared/orm/sequelize/transactional.annotation";
import WalletService from "../wallet.service";

/**
 * Eu não consegui entender a idéia de fazer operações em cache como são as subtrações e
 * adições de saldo. Isso é problemático para garantir as características ACID da transação
 * por diversos motivos. Então eu acredito que apenas as consultas devem se basear no TTL
 * do redis para melhorar o desempenho da aplicação, neste caso específico, obviamente.
 */
@injectable()
export class WalletServiceImpl implements WalletService {

    constructor(@inject("user-repository") private userRepository: UserRepository,
        @inject("user-cache-repository") private userCacheRepository: CacheRepository<UserEntity>,
        @inject("wallet-repository") private walletRepository: WalletRepository,
        @inject("wallet-cache-repository") private walletCacheRepository: CacheRepository<WalletEntity>,
        @inject("wallet-mapper") private walletMapper: WalletMapper) { }

    /**
     * 
     * @param dto 
     * @returns 
     */
    @transactional()
    public async createWallet(dto: CreateWalletRequest): Promise<CreateWalletResponse> {
        let user = this.userCacheRepository.findById(dto.userId);
        if (!user) {
            user = this.userRepository.findById(dto.userId);
            if (!user) {
                throw new EntityNotFoundError("Failed to create wallet: User not found");
            }
        }

        const walletEntity = this.walletMapper.createWalletRequestToWalletEntity(dto);

        try {
            const persistedWalletEntity = await this.walletRepository.save(walletEntity);
            // Aqui cabe a orientação das regras de negócio se o cache deve
            // fazer parte da regra do rollback da transação
            await this.walletCacheRepository.save(walletEntity);
            return this.walletMapper.walletEntityToCreateWalletResponse(persistedWalletEntity);
        } catch (error: unknown) {
            winston.error("Error persisting wallet", error);
            if (error instanceof CacheError) throw error;
            if (error instanceof ForeignKeyConstraintError)
                throw new EntityNotFoundError("The user associated with that wallet do not exist");
            throw new DiscoverableError(error, `Failed to persist wallet: ${error}`);
        }
    }

    /**
     * find the wallet on cache, if it is not present it searches on database
     * @param userId 
     * @param walletName 
     * @returns 
     */
    @transactional()
    public async findWallet(userId: string, walletName: string): Promise<WalletResponse> {
        const cachedWallet = await this.walletCacheRepository.findById(WalletCacheKey(userId, walletName));
        if (cachedWallet) return this.walletMapper.walletEntityToWalletResponse(cachedWallet);

        const databaseWallet = await this.walletRepository.findByUserAndWalletName(userId, walletName);
        if (databaseWallet) {
            this.walletCacheRepository.save(databaseWallet);
            return databaseWallet;
        }

        winston.error(`Wallet with userId ${userId} and walletName ${walletName} not found.`);
        throw new EntityNotFoundError(`Wallet with userId ${userId} and walletName ${walletName} not found.`);
    }

    /**
     * 
     * @param req 
     * @returns 
     */
    @transactional()
    public async addBalanceToWallet(dto: AddToWalletRequest): Promise<AddToWalletResponse> {

        try {
            const entity = await this.walletRepository.increaseBalance(dto.userId, dto.walletName, dto.balance);
            // Aqui cabe a orientação das regras de negócio se o cache deve
            // fazer parte da regra do rollback da transação
            if (!entity) throw new EntityNotFoundError(`Wallet with userId ${dto.userId} and walletName ${dto.walletName} not found.`);

            await this.walletCacheRepository.save(entity);

            return this.walletMapper.walletEntityToAddToWalletResponse(entity);
        } catch (error: unknown) {
            winston.error("Error updating for increasing wallet balance", error);
            if (error instanceof CacheError) throw error;
            throw new DiscoverableError(error, `Failed to update wallet: ${error}`);
        }
    }

    /**
     * 
     * @param req 
     * @returns 
     */
    @transactional()
    public async subtractBalanceFromWallet(dto: SubFromWalletRequest): Promise<SubFromWalletResponse> {
        try {
            const entity = await this.walletRepository.decreaseBalance(dto.userId, dto.walletName, dto.balance);
            // Aqui cabe a orientação das regras de negócio se o cache deve
            // fazer parte da regra do rollback da transação
            if (!entity) throw new EntityNotFoundError(`Wallet with userId ${dto.userId} and walletName ${dto.walletName} not found.`);

            await this.walletCacheRepository.save(entity);
            return this.walletMapper.walletEntityToSubFromWalletResponse(entity);
        } catch (error: unknown) {
            winston.error("Error updating for increasing wallet balance", error instanceof Error ? error.message : error);
            if (error instanceof CacheError) throw error;
            if (error instanceof RepositoryError) throw new InsuficientBalanceError("Insufficient funds")
            throw new DiscoverableError(error, `Failed to update wallet: ${error}`);
        }
    }
}