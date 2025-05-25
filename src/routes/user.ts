import express from 'express';
import { NextFunction, Request, Response} from "express"
import { TenantController } from '../controllers/TenantController';
import { TenantService } from '../services/TenantService';
import { AppDataSource } from '../config/data-source';
import { Tenant } from '../entity/Tenant';
import logger from '../config/logger';
import authenticate from '../middlewares/authenticate';
import { canAccess } from '../middlewares/canAccess';
import { Roles } from '../constants';
import tenantValidator from '../validators/tenant-validator';
import { UserController } from '../controllers/UserController';
import { UserService } from '../services/userService';
import { User } from '../entity/User';


const router = express.Router();

const userRepository = AppDataSource.getRepository(User);

const userService = new UserService(userRepository);

const userController = new UserController(userService);


router.post(
    "/",
    authenticate,
    //only admin can access this route
    canAccess([Roles.ADMIN]),
    (request: Request, response: Response, next: NextFunction)=>{
    userController.create(request, response, next);
})



// router.get(
//     "/",
//     authenticate,
//     //only admin can access this route
//     canAccess([Roles.ADMIN]),
//     (request: Request, response: Response, next: NextFunction)=>{
//     tenantController.getTenantsList(request, response, next);
// })



// router.get(
//     "/:id",
//     authenticate,
//     //only admin can access this route
//     canAccess([Roles.ADMIN]),
//     (request: Request, response: Response, next: NextFunction)=>{
//     tenantController.getTenantByID(request, response, next);
// })




// router.put(
//     "/:id",
//     tenantValidator,
//     authenticate,
//     //only admin can access this route
//     canAccess([Roles.ADMIN]),
//     (request: Request, response: Response, next: NextFunction)=>{
//     tenantController.updateTenantData(request, response, next);
// })




// router.delete(
//     "/:id",
//     authenticate,
//     //only admin can access this route
//     canAccess([Roles.ADMIN]),
//     (request: Request, response: Response, next: NextFunction)=>{
//     tenantController.deleteTenantData(request, response, next);
// })





export default router;