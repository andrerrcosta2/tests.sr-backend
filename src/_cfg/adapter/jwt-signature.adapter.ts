import { injectable } from "tsyringe";
import { JWTSignatureProperties } from "../../shared/security/jwt/model/signature.properties";
import { appProperties } from "../environment.config";
import { ConfigurationError } from "../../model/error/configuration.error";
import { FileUtil } from "../../shared/util/file.util";

@injectable()
export class JWTSignatureAdapter {

    public buildJwtSignatureProperties(): JWTSignatureProperties {
         const security = appProperties.security;
        if(!security) {
            throw new ConfigurationError("Injection failed. No security properties was declared")
        }
        return {
            algorithm: security.signature.algorithm!,
            expiration: security.tokenManagement.expiration,
            privateKeyPath: FileUtil.buildFilePath(...security.signature.privateKeyPath || []),
            publicKeyPath: FileUtil.buildFilePath(...security.signature.publicKeyPath || []),
            secretKey: security.signature.secretKey
        }
    }
}