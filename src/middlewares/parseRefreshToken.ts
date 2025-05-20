import { expressjwt } from "express-jwt";
import { Config } from "../config";
import { AuthCookie, IRefreshTokenPayload } from "../types";
import {Request} from "express";


export default expressjwt({
    //the same key which was used to sign the refresh token will be used to verify the token
    secret: Config.REFRESH_TOKEN_SECRET!,
    algorithms: ['HS256'],
    getToken(req: Request){
        const {refreshToken} = req.cookies as AuthCookie;
        return  refreshToken
    },
    

})