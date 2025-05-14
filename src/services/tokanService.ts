import { JwtPayload, sign } from "jsonwebtoken";
import fs from "fs";
import createHttpError from "http-errors";
import path from "path";
import { Config } from "../config";
import { RefreshToken } from "../entity/RefreshToken";
import { User } from "../entity/User";
import { Repository } from "typeorm";


export class TokenService{
    //dependency injection in constructor method
    constructor(private refreshTokenRepository: Repository<RefreshToken>){}

    generateAccessToken(payload : JwtPayload){
        let privateKey: Buffer;
        let publicKey: Buffer;

            try{
                privateKey = fs.readFileSync(path.join(__dirname, "../../certs/private.pem"));
                // publicKey = fs.readFileSync(path.join(__dirname, "../../certs/public.pem"));
            }catch(err){
                const error = createHttpError(500, "Error while reading private key");
                throw error;
            }
        
        const accessToken = sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: "1h",
            issuer: "auth-service",
        });
        return accessToken;
    }


    generateRefreshToken(payload: JwtPayload){
        const refreshToken = sign(payload, Config.REFRESH_TOKEN_SECRET!, {
            algorithm: "HS256",
            expiresIn: "1y",
            issuer: "auth-service",
            jwtid: String(payload.id)
        });

        return refreshToken;
    }


    async persistRefreshToken(user: User){
        // persist (save) the refresh token in the DB
        const MILLI_SECONDS_IN_YEAR = 1000 * 60 * 60 * 24 * 365;

        const newRefreshToken = await this.refreshTokenRepository.save({
            user: user,
            expiresAt: new Date(Date.now() + MILLI_SECONDS_IN_YEAR)
        });
        
        return newRefreshToken;
    }
}