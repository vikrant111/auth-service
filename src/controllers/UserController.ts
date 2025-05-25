import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/userService";
import { CreateUserRequest, UserData } from "../types";
import { Roles } from "../constants";


export class UserController{

    constructor(private userService: UserService){}

    async create(
        request: CreateUserRequest,
        response: Response,
        next: NextFunction
    ){

        const {firstName, lastName, email, password} = request.body;

        try{
            const user = await this.userService.create({firstName, lastName, email, password, role: Roles.MANAGER})

            response.status(201).json({id: user.id})
        }catch(err){
            next(err)
        }

    }

}