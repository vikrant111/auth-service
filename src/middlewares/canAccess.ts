import { NextFunction, Request, Response} from "express"
import { AuthRequest } from "../types"
import createHttpError from "http-errors";

export const canAccess = (roles: string[]) =>{
    return (request: Request, response: Response, next: NextFunction) =>{
        const _request = request as AuthRequest;
        const roleFromToken = _request.auth.role

        if(!roles.includes(roleFromToken)){
            const error = createHttpError(403, "You don't have enough permissions")
            next(error)
            return;
        }
        next()

    }
}