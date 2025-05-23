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


const router = express.Router();

const tenantRepository = AppDataSource.getRepository(Tenant);

const tenantService = new TenantService(tenantRepository);

const tenantController = new TenantController(tenantService, logger);


router.post(
    "/",
    tenantValidator,
    authenticate,
    //only admin can access this route
    canAccess([Roles.ADMIN]),
    (request: Request, response: Response, next: NextFunction)=>{
    tenantController.create(request, response, next);
})



router.get(
    "/",
    authenticate,
    //only admin can access this route
    canAccess([Roles.ADMIN]),
    (request: Request, response: Response, next: NextFunction)=>{
    tenantController.getTenantsList(request, response, next);
})





export default router;