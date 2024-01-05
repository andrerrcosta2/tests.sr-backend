import { Transaction, UniqueConstraintError } from "sequelize";
import { inject, injectable } from "tsyringe";
import { winston } from "../../_cfg/logger.config";
import { UserEntity } from "../../data-access/user/entity/user.entity";
import { UserMapper } from "../../data-access/user/mapper/user.mapper";
import { AuthHelper } from "../../helper/auth.helper";
import { CacheError } from "../../model/error/cache.error";
import { DiscoverableError } from "../../model/error/discoverable.error";
import { DomainValidationError } from "../../model/error/domain-validation.error";
import { CreateUserRequest } from "../../model/user/create-user.request";
import { CreateUserResponse } from "../../model/user/create-user.response";
import { CacheRepository } from "../../repository/cache.repository";
import { UserRepository } from "../../repository/user.repository";
import { transactional } from "../../shared/orm/sequelize/transactional.annotation";
import { UserService } from "../user.service";

@injectable()
export class UserServiceImpl implements UserService {

    constructor(@inject("user-repository") private repository: UserRepository,
        @inject("user-cache-repository") private cacheRepository: CacheRepository<UserEntity>,
        @inject("user-mapper") private mapper: UserMapper,
        @inject("auth-helper") private authHelper: AuthHelper) { }

    @transactional({ retries: 0, delayMs: 250 })
    public async createUser(dto: CreateUserRequest, transaction?: Transaction): Promise<CreateUserResponse> {
        const entity = this.mapper.createUserRequestToUserEntity(dto);

        try {
            entity.password = await this.authHelper.hashPassword(entity.password);
            const savedUser = await this.repository.save(entity, transaction);
            /**
             * Esse é um ponto curioso.
             * o método save do UserCacheRepository é assíncrono mas as
             * transações são auto-commitables. Isso significa que não
             * utilizar o await aqui depende de regras de negócio específicas
             * como "o caching deve fazer parte das condições de um rollback?"
             * A princípio eu vou usar apenas para garantir as condições de rollback
             * da anotação experimental. Embora não seja um ponto crítico pode ser
             * útil fazer algum log para alertar os desenvolvedores sobre possíveis
             * erros da estrutura do serviço.
             */
            await this.cacheRepository.save(savedUser);
            return this.mapper.userEntityToCreateUserResponse(savedUser);

        } catch (error: unknown) {
            winston.info(`Error saving user : ${error}`);
            if (error instanceof CacheError) throw error;
            if (error instanceof UniqueConstraintError)
                throw new DomainValidationError("This email already exist");
            throw new DiscoverableError(error, `Failed to create user: ${error}`);
        }
    }

}