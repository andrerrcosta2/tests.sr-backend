import { JwtSignatureAlgorithm } from "./signature-algorithm.type";

export interface JWTSignatureProperties {
    algorithm: JwtSignatureAlgorithm;
    privateKeyPath?: string;
    publicKeyPath?: string;
    secretKey?: string;
    expiration?: number;
}