import { NextFunction, Response, Request  } from "express";
import {JwtPayload, sign} from "jsonwebtoken";
import { AuthRequest, RegisterUserRequest } from "../types";
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
import { CredentialService } from "../services/CredentialService";
import { User } from "../entity/User";



export class AuthController {
   constructor(
    private userService: UserService,
    private logger: Logger,
    private tokenService: TokenService,
    private credentialService: CredentialService
){}

// ----------------REGISTER--------------------


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



// ------------------LOGIN--------------------



 async login(req: RegisterUserRequest, res: Response, next: NextFunction){

        const result = validationResult(req);
        if (!result.isEmpty()) {
            res.status(400).json({errors: result.array()})
            return
        }


        const {email, password} = req.body;

        this.logger.debug("New request to login a user", { email, password:"******"})

        //Check if the user email already exists in the db
        //compare password
        //generate tokens
        //add tokens to cookies
        //return the reponse(id)

        try{

            const user = await this.userService.findByEmail(email)
            if(!user){
                const error = createHttpError(400, "Email or password does not match!");
                next(error)
                return;
            }

            //Compare password
            const passwordMatch = await this.credentialService.comparePassword(password, user.password)

            if(!passwordMatch){
                const error = createHttpError(400, "Email or password does not match!")
                next(error);
                return;
            }
            
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

            this.logger.info("user has been logged in", {id: user.id})
            res.status(200).json({id: user.id})
        }catch(err){
            next(err)
            return;
        }
        
       
    }




 async self(request: AuthRequest, response: Response){
        //extract the user id ...from token... req.auth.id
        console.log(request.auth)
        const user = await this.userService.findById(Number(request.auth.sub))
        response.json({...user, password: undefined})
    }




async refresh(request: AuthRequest, response: Response, next: NextFunction){
    try {
        const payload: JwtPayload = {
            sub: request.auth.sub,
            role: request.auth.role
        }

        const user = await this.userService.findById(Number(request.auth.sub))
        if(!user){
            const error = createHttpError(400, "User with the token could not find!");
            next(error)
            return;
        }

        
        // Generate new access token
        const accessToken = this.tokenService.generateAccessToken(payload);

        
        // Create and persist new refresh token
        const newRefreshToken = await this.tokenService.persistRefreshToken(user);
        
        // Delete the old refresh token first
        await this.tokenService.deleteRefreshToken(Number(request.auth.id));
        
        // Generate new refresh token with the new ID
        const refreshToken = this.tokenService.generateRefreshToken({
            ...payload,
            id: String(newRefreshToken.id)
        });

        response.cookie('accessToken', accessToken, {
            domain: 'localhost',
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60, // 1 hour
            httpOnly: true
        });

        response.cookie('refreshToken', refreshToken, {
            domain: 'localhost',
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
            httpOnly: true
        });

        this.logger.info("Tokens rotated successfully", {userId: user.id});
        response.status(200).json({id: user.id});
    } catch(err) {
        next(err);
        return;
    }
}












}