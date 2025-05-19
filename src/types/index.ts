import { Request, Response } from "express";


export interface UserData{
    firstName: string,
    lastName: string,
    email: string,
    password: string
}

export interface RegisterUserRequest extends Request{
    body: UserData
}


export interface AuthRequest extends Request{
    auth: {
        sub: string;
        role: number;
    }
}

export type AuthCookie = {
    accessToken: string;
    refreshToken: string;
}

interface IRefreshTokenPayload {
    id: string;
}