import { NextFunction, Request, Response } from "express";
import { TenantService } from "../services/TenantService";
import { CreateTenantRequest, TenantQueryParams } from "../types";
import { add, Logger } from "winston";
import { matchedData, validationResult } from "express-validator";

export class TenantController {
  constructor(

    private tenantService: TenantService,
    private logger: Logger

    ) {}

  async create(
    request: CreateTenantRequest,
    response: Response,
    next: NextFunction
  ) {

    const result = validationResult(request);
      if (!result.isEmpty()) {
          response.status(400).json({errors: result.array()})
          return
      }


    const { name, address } = request.body;

     this.logger.debug("Request for creating the tenant", request.body)


    try {
      const tenant = await this.tenantService.create({
        name: name,
        address: address,
      });

      this.logger.info("Successfully created a tenant", {id: tenant.id})

      response.status(201).json({ id: tenant.id });
    } catch (err) {
      next(err);
    }
  }




   async getTenantsList(
    request: Request,
    response: Response,
    next: NextFunction
  ){
    const validatedQuery = matchedData(request, { onlyValidData: true });

    try {

      const [allTenants, count] = await this.tenantService.tenantsList(validatedQuery as TenantQueryParams,);

      this.logger.info("Successfully listed tenants", allTenants)

      response.status(200).json({
                currentPage: validatedQuery.currentPage as number,
                perPage: validatedQuery.perPage as number,
                total: count,
                data: allTenants,
            });
    } catch (err) {
      next(err);
    }

  }




  async getTenantByID(
    request: Request,
    response: Response,
    next: NextFunction){

      const tenantId = request.params.id;

      try{

      if(!tenantId){
        response.status(400).json({error:"Tenant id is required!"})
        return;
      }

      const tenant = await this.tenantService.tenantByID(Number(tenantId));

      if(!tenant){
        return response.status(404).json({error: "Tenant not found!"})
      }

       response.status(200).json({tenant})

      }catch(err){
        next(err)
      }

  }




  async updateTenantData(
    request: Request,
    response: Response,
    next: NextFunction){

      const tenantId = request.params.id
      const {name, address} = request.body;

      try{

      const result = validationResult(request);
      if (!result.isEmpty()) {
          response.status(400).json({errors: result.array()})
          return
      }



     if (!tenantId || isNaN(Number(tenantId))) {
      return response.status(400).json({ error: "Valid tenant ID is required in the URL!" });
    }

      const tenant = await this.tenantService.tenantByID(Number(tenantId));

      if(!tenant){
        return response.status(404).json({error: "Tenant not found!"});
      }

       const updated = await this.tenantService.updateTenant(Number(tenantId), {name, address});
    return response.status(200).json(updated);

      }catch(err){
        next(err)
      }



  }




  
  async deleteTenantData(
    request: Request,
    response: Response,
    next: NextFunction){

      const tenantId = request.params.id

      try{


     if (!tenantId || isNaN(Number(tenantId))) {
      return response.status(400).json({ error: "Valid tenant ID is required in the URL!" });
    }

      const tenant = await this.tenantService.tenantByID(Number(tenantId));

      if(!tenant){
        return response.status(404).json({error: "Tenant not found!"});
      }

       const deletedTenant = await this.tenantService.deleteTenant(Number(tenantId));
    return response.status(200).json(deletedTenant);

      }catch(err){
        next(err)
      }



  }





}