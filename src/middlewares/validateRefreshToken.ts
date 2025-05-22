import { expressjwt } from "express-jwt";
import { Config } from "../config";
import { AuthCookie, IRefreshTokenPayload } from "../types";
import {Request} from "express";
import { AppDataSource } from "../config/data-source";
import { RefreshToken } from "../entity/RefreshToken";
import { Jwt } from "jsonwebtoken";
import logger from "../config/logger";

export default expressjwt({
    //the same key which was used to sign the refresh token will be used to verify the token
    secret: Config.REFRESH_TOKEN_SECRET!,
    algorithms: ['HS256'],
    getToken(req: Request){
        const {refreshToken} = req.cookies as AuthCookie;
        console.log("getToken Refresh---------->", refreshToken)
        return  refreshToken
    },
    //isRevoked method will check whether the refreshtoken from the refresh token database as deleted before
    //i.e whether the user have logged out of the application
        async isRevoked(req: Request, token){
            try{
            // console.log("this is revoked token----------------> ", token)
            const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);
            const refreshToken = await refreshTokenRepository.findOne({
                where:{
                    id: Number((token?.payload as IRefreshTokenPayload).id),
                    user: {id: Number(token?.payload?.sub)}
                }
            })
            return refreshToken === null;
        }catch(err){
            
            logger.error("Error while getting the refresh token", {
                id: Number((token?.payload as IRefreshTokenPayload).id)
            })
            return true;
        }
    }

})