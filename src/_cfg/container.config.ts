import { container } from "tsyringe";
import { AuthController } from "../controller/auth.controller";
import { UserController } from "../controller/user.controller";
import { WalletController } from "../controller/wallet.controller";
import { UserRedisRepository } from "../data-access/user/adapter/user-redis.repository";
import { UserSequelizeRepository } from "../data-access/user/adapter/user-sequelize.repository";
import { UserMapper } from "../data-access/user/mapper/user.mapper";
import { WalletRedisRepository } from "../data-access/wallet/adapter/wallet-redis.repository";
import { WalletSequelizeRepository } from "../data-access/wallet/adapter/wallet-sequelize.repository";
import { WalletMapper } from "../data-access/wallet/mapper/wallet.mapper";
import { RouteConfig } from "../route";
import { AuthServiceImpl } from "../service/impl/auth.service.impl";
import { UserServiceImpl } from "../service/impl/user.service.impl";
import { WalletServiceImpl } from "../service/impl/wallet.service.impl";
import { RedisConfig } from "./cache.config";
import { MySqlConfig } from "./mysql.config";
import { SequelizeConfig } from "./sequelize.config";
import { AuthHelper } from "../helper/auth.helper";
import { UserDetailsHelper } from "../helper/user-details.helper";
import { JwtHandler } from "../shared/security/jwt/jwt.handler";
import { JWTSignatureAdapter } from "./adapter/jwt-signature.adapter";
import { JWTClaimsAdapter } from "./adapter/jwt-claims.adapter";

// Configuration

container.registerSingleton('redis-config', RedisConfig);
container.registerSingleton('database-config', MySqlConfig);
container.registerSingleton('sequelize-config', SequelizeConfig);

//Mapper
container.registerInstance("wallet-mapper", new WalletMapper());
container.registerInstance("user-mapper", new UserMapper());

//Repository
container.registerSingleton("wallet-repository", WalletSequelizeRepository);
container.registerSingleton("user-repository", UserSequelizeRepository);
container.registerSingleton("user-cache-repository", UserRedisRepository);
container.registerSingleton("wallet-cache-repository", WalletRedisRepository);

//Helper
container.registerSingleton("jwt-handler", JwtHandler);
container.registerSingleton("jwt-signature-adapter", JWTSignatureAdapter);
container.registerSingleton("jwt-claims-adapter", JWTClaimsAdapter);
container.registerSingleton("user-details-helper", UserDetailsHelper);
container.registerSingleton("auth-helper", AuthHelper);

//Service
container.registerSingleton("auth-service", AuthServiceImpl);
container.registerSingleton("wallet-service", WalletServiceImpl);
container.registerSingleton("user-service", UserServiceImpl);

// Controller
container.registerSingleton('auth-controller', AuthController);
container.registerSingleton('user-controller', UserController);
container.registerSingleton('wallet-controller', WalletController);


// Routes
container.registerSingleton("route-config", RouteConfig);






