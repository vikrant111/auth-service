import { NextFunction, Response } from "express";
import {JwtPayload, sign} from "jsonwebtoken";
import { RegisterUserRequest } from "../types";
import { UserService } from "../services/userService";
import logger from "../config/logger";
import { Logger } from "winston";
import createHttpError from "http-errors";
import { validationResult } from "express-validator";
import fs from "fs";
import path from "path";
import { Config } from "../config";
import { AppDataSource } from "../config/data-source";
import { RefreshToken } from "../entity/RefreshToken";
import { TokenService } from "../services/tokanService";



export class AuthController {
   constructor(
    private userService: UserService,
    private logger: Logger,
    private tokenService: TokenService
){}


    async register(req: RegisterUserRequest, res: Response, next: NextFunction){

        const result = validationResult(req);
        if (!result.isEmpty()) {
            res.status(400).json({errors: result.array()})
            return
        }


        const {firstName, lastName, email, password} = req.body;

        this.logger.debug("New request to register a user", {firstName, lastName, email, password:"******"})
        try{
            const user = await this.userService.create({firstName, lastName, email, password})
            this.logger.info("User has been registered", {id: user.id})

            let publicKey: Buffer;
             
            const payload: JwtPayload = {
                sub: String(user.id),
                role: String(user.role),
            }


            const accessToken = this.tokenService.generateAccessToken(payload)
            
            const newRefreshToken = await this.tokenService.persistRefreshToken(user)
            
            const refreshToken = this.tokenService.generateRefreshToken({...payload, id: String(newRefreshToken.id)});


            res.cookie('accessToken', accessToken, {
                domain: 'localhost',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60, // 1 hour
                httpOnly:  true // very important

            })


            res.cookie('refreshToken', refreshToken, {
                domain: 'localhost',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
                httpOnly:  true // very important

            })

            res.status(201).json({id: user.id})
        }catch(err){
            next(err)
            return;
        }
        
       
    }
}