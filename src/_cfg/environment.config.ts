import { CacheProperties } from "./properties/cache.properties";
import { DataStoreProperties } from "./properties/data-store.properties";
import { DatabaseProperties } from "./properties/database.properties";
import { AuthenticationAlgorithm, AuthenticationMethod, AuthenticationType, SecurityProperties, SignatureAlgorithm, SignatureType } from "./properties/security.properties";

export const isProduction = process.env.NODE_ENV === 'production';
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isStaging = process.env.NODE_ENV === 'staging';
export const isTest = process.env.NODE_ENV === 'test';

interface AppProperties {
    environment?: string;
    database?: DatabaseProperties;
    cache?: CacheProperties;
    security?: SecurityProperties,
    dataStore?: DataStoreProperties
}

export const appProperties: AppProperties = {
    environment: process.env.NODE_ENV,
    database: {
        database: process.env.DB_SCHEMA || 'default_schema',
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT || "5432",
        logging: Boolean(process.env.DB_LOGGING),
        dialect: process.env.DB_DIALECT || "postgres",
        pool: {
            min: Number(process.env.DB_POOL_MIN),
            acquire: Number(process.env.DB_POOL_MAX),
            iddle: Number(process.env.DB_POOL_ACQUIRE_TIMEOUT_IN_MS),
            max: Number(process.env.DB_POOL_MAX),
            logging: Boolean(process.env.DB_LOGGING)
        },
        def: {
            timestamps: Boolean(process.env.DB_DEF_TIMESTAMPS),
            version: Boolean(process.env.DB_DEF_VERSION),
            underscored: Boolean(process.env.DB_DEF_UNDERSCORED)
        }
    },
    cache: {
        host: process.env.CACHE_HOST || 'redis://localhost',
        port: Number(process.env.CACHE_PORT),
        expirationInSeconds: Number(process.env.CACHE_EXPIRATION_IN_SECONDS)
    },
    dataStore: {
        host: process.env.ELASTIC_HOST || 'localhost',
        port: Number(process.env.ELASTIC_PORT) || 9200
    },
    security: {
        authentication: {
            method: process.env.AUTHENTICATION_METHOD as AuthenticationMethod || 'Basic',
            token: {
                algorithm: process.env.AUTHENTICATION_TOKEN as AuthenticationAlgorithm || "Basic",
                type: process.env.AUTHENTICATION_TOKEN_TYPE as AuthenticationType || "secret"
            },
        },
        authorization: {
            claims: process.env.AUTHORIZATION_CLAIMS?.split(',') || [],
        },
        signature: {
            algorithm: process.env.SIGNATURE_ALGORITHM as SignatureAlgorithm || 'HS256',
            type: process.env.SIGNATURE_ALGORITHM as SignatureType || 'secret',
            privateKeyPath: process.env.SIGNATURE_PRIVATE_KEY_PATH?.split(','),
            publicKeyPath: process.env.SIGNATURE_PUBLIC_KEY_PATH?.split(','),
            secretKey: process.env.SIGNATURE_SECRET_KEY
        },
        tokenManagement: {
            expiration: Number(process.env.TOKEN_EXPIRATION) || 600,
            refreshTokens: {
                enabled: Boolean(process.env.TOKEN_ENABLE_REFRESH) || false,
                expiresIn: Number(process.env.TOKEN_REFRESH_EXPIRATION) || 0
            }
        }
    }
};