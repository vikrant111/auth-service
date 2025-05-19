import { expressjwt } from "express-jwt";
import { Config } from "../config";
import { AuthCookie } from "../types";
import {Request} from "express";
import { AppDataSource } from "../config/data-source";
import { RefreshToken } from "../entity/RefreshToken";
import { Jwt } from "jsonwebtoken";
import logger from "../config/logger";

export default expressjwt({
    secret: Config.REFRESH_TOKEN_SECRET!,
    algorithms: ['HS256'],
    getToken(req: Request){
        const {refreshToken} = req.cookies as AuthCookie;
        return  refreshToken
    },
    async isRevoked(req: Request, token){
        try{
            const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);
            const refreshToken = await refreshTokenRepository.findOne({
                where:{
                    id: Number(token?.payload?.id),
                    user: {id: Number(token?.payload?.sub)}
                }
            })
            return refreshToken === null;
        }catch(err){
            
            logger.error("Error while getting the refresh token", {id: token.payload.id})
            return true;
        }
    }

})