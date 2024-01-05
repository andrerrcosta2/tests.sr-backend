import fs from "fs";
import jwt from 'jsonwebtoken';
import { injectable } from "tsyringe";
import { FileReadError } from "../../io/file-read.error";
import { FileUtil } from '../../util/file.util';
import { JWTDecodingError } from './error/jwt-decoding.error';
import { JWTSignatureError } from "./error/jwt-signature.error";
import { JWTSignatureProperties } from './model/signature.properties';


@injectable()
export class JwtHandler {

    public generateSignedToken = (payload: any, properties: JWTSignatureProperties): string => {
        switch (properties.algorithm) {
            case "RS256":
                return this.rsa256Signature(payload, String(properties.privateKeyPath), properties.expiration);

            default:
                throw new JWTSignatureError("Algorithm signature not implemented");

        }
    }

    private rsa256Signature = (payload: any, privateKeyPath: string, expiresIn?: number): string => {
        // const privateKeyPath = path.join(__dirname, 'private.pem');
        if (FileUtil.fileExists(privateKeyPath)) {
            const privateKey = fs.readFileSync(privateKeyPath, 'utf8');

            if (payload.exp) {
                return jwt.sign(payload, privateKey, {
                    algorithm: 'RS256'
                });
            } else {
                return jwt.sign(payload, privateKey, {
                    algorithm: 'RS256',
                    expiresIn
                });
            }
        }
        throw new FileReadError(`Error reading private key on ${privateKeyPath}`);
    }

    public verifyToken = (token: string, properties: JWTSignatureProperties): string | jwt.JwtPayload=> {
        switch (properties.algorithm) {
            case "RS256":
                return this.verifyRsa256Token(token, String(properties.privateKeyPath));

            default:
                throw new JWTSignatureError("Algorithm signature not implemented");

        }
    }

    private verifyRsa256Token = (token: string, publicKeyPath: string): string | jwt.JwtPayload => {
        if (FileUtil.fileExists(publicKeyPath)) {
            const publicKey = fs.readFileSync(publicKeyPath, 'utf8');
            try {
                const decoded = jwt.verify(token, publicKey, {
                    algorithms: ['RS256']
                });
                return decoded;
            } catch (error) {
                throw new JWTDecodingError('Invalid token');
            }
        }
        throw new FileReadError(`Error reading public key on ${publicKeyPath}`);
    }
}