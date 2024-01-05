import { injectable } from "tsyringe";
import { v4 } from 'uuid';
import { ConfigurationError } from "../../model/error/configuration.error";
import { JWTClaims } from "../../shared/security/jwt/model/jwt-claims.model";
import { appProperties } from "../environment.config";

@injectable()
export class JWTClaimsAdapter {
    public generatePayload(sub: string): JWTClaims {
        if (!appProperties || !appProperties.security) {
            throw new ConfigurationError("Configuration Error. No security properties were found")
        }
        const { authorization, tokenManagement } = appProperties.security;

        const jwtClaims: JWTClaims = {};

        authorization.claims?.forEach((claim: string) => {
            switch (claim.trim()) {
                case 'iss':
                    jwtClaims.iss = 'iss';
                    break;
                case 'sub':
                    jwtClaims.sub = sub;
                    break;
                case 'aud':
                    jwtClaims.aud = 'aud';
                    break;
                case 'exp':
                    jwtClaims.exp = (!tokenManagement || !tokenManagement.expiration || tokenManagement.expiration <= 0) ?
                        undefined :
                        Math.floor(Date.now() / 1000) + (tokenManagement.expiration);
                    break;
                case 'iat':
                    jwtClaims.iat = Math.floor(Date.now() / 1000);
                    break;
                case 'jti':
                    jwtClaims.jti = v4();
                    break;
                case 'nbf':
                    jwtClaims.nbf = 0;
                    break;
                default:
                    break;
            }
        });

        return jwtClaims;
    }
}