export type AuthenticationMethod = 'JWT' | 'OAuth' | 'Basic';
export type AuthenticationAlgorithm = 'JWT' | 'OAuth' | 'Basic';
export type AuthenticationType = 'secret' | 'key-pair';
export type SignatureAlgorithm = 'HS256' | 'HS384' | 'RS256' | 'RS384';
export type SignatureType = 'secret' | 'public-key';

export interface SecurityProperties {
    authentication: {
        method: AuthenticationMethod;
        token?: {
            algorithm?: AuthenticationAlgorithm;
            type?: AuthenticationType;
        };
    };
    authorization: {
        claims?: string[]; 
    };
    signature: {
        algorithm?: SignatureAlgorithm;
        type?: SignatureType;
        publicKeyPath?: string[],
        privateKeyPath?: string[],
        secretKey?: string
    };
    tokenManagement: {
        expiration?: number; 
        refreshTokens?: {
            enabled?: boolean;
            expiresIn?: number;
        };
        blacklist?: {
            enabled?: boolean;
        };
    };
}