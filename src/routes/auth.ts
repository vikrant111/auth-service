import express, {Request, Response, NextFunction } from "express";
import { AuthController } from "../controllers/AuthController";
import { UserService } from "../services/userService";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import logger from "../config/logger";
import registerValidator from "../validators/register-validator";
import { AuthRequest, RegisterUserRequest } from "../types";
import { TokenService } from "../services/tokanService";
import { RefreshToken } from "../entity/RefreshToken";
import loginValidator from "../validators/login-validator";
import { CredentialService } from "../services/CredentialService";
import authenticate from "../middlewares/authenticate";


const router = express.Router();
const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);
const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);
const tokenService = new TokenService(refreshTokenRepository);
const credentialService = new CredentialService();
const authController = new AuthController(userService, logger, tokenService, credentialService);


router.post(
    "/register",
    registerValidator, 
    (req: Request, res: Response, next: NextFunction) =>
         authController.register(req, res, next)
);


router.post(
    "/login",
    loginValidator, 
    (req: Request, res: Response, next: NextFunction) =>
         authController.login(req, res, next)
);


router.get(
    "/self", 
    authenticate,
    (req: Request, res: Response) => authController.self(req as AuthRequest, res)
);



router.post(
    "/refresh", 
    (req: Request, res: Response) => authController.refresh(req, res)
);


export default router;
