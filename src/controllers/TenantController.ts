import { NextFunction, Request, Response } from "express";
import { TenantService } from "../services/TenantService";
import { CreateTenantRequest } from "../types";
import { Logger } from "winston";

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
}