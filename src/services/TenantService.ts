import { Repository } from "typeorm";
import { ITenant } from "../types";
import { Tenant } from "../entity/Tenant";

export class TenantService {
  constructor(private tenantRepository: Repository<Tenant>) {}

  async create(tenantData: ITenant) {
    return await this.tenantRepository.save(tenantData);
  }


  async updateTenant(id: number, tenantData: Partial<ITenant>) {
  const tenant = await this.tenantRepository.findOne({ where: { id } });

  if (!tenant) {
    throw new Error(`Tenant with ID ${id} not found`);
  }

  const updatedTenant = {
    ...tenant,
    ...tenantData,
  };

   await this.tenantRepository.update(id, tenantData);
   return updatedTenant
}


  async tenantsList() {
    const tenants = await this.tenantRepository.find({
      order:{
        id: "ASC"
      }
    });
    return tenants;
  }

  async tenantByID(id: number) {
    const tenant = await this.tenantRepository.findOne({
      where: {
        id: id,
      },
    });
    return tenant;
  }
}
