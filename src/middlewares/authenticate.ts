import {expressjwt, GetVerificationKey} from "express-jwt";
import { Request } from "express";
import { Config } from "../config";
import jwksClient from "jwks-rsa"
import { AuthCookie } from "../types";

export default expressjwt({
    secret: jwksClient.expressJwtSecret({
        //the url where you are going to host your public key
        jwksUri: Config.JWKS_URI!,
        cache: true,
        rateLimit: true
    }) as GetVerificationKey,
    algorithms: ['RS256'],
    getToken(request: Request){
        const authHeader = request.headers.authorization;
        // authHeader = Bearer eyjngdhfdskjfdskjfhdkj....
        if(authHeader && authHeader.split(' ')[1] !== 'undefined'){
            const token = authHeader.split(' ')[1]
            if(token){
                return token;
            }
        }

  
        const {accessToken} = request.cookies as AuthCookie;
        return accessToken;

    }
})