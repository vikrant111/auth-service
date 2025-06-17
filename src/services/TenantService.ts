import { Repository } from "typeorm";
import { ITenant, TenantQueryParams } from "../types";
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


  async tenantsList(validatedQuery: TenantQueryParams) {
    // const tenants = await this.tenantRepository.find({
    //   order:{
    //     id: "ASC"
    //   }
    // });
    // return tenants;
    const queryBuilder = this.tenantRepository.createQueryBuilder("tenant");

        if (validatedQuery.q) {
            const searchTerm = `%${validatedQuery.q}%`;
            queryBuilder.where(
                "CONCAT(tenant.name, ' ', tenant.address) ILike :q",
                { q: searchTerm },
            );
        }

        const result = await queryBuilder
            .skip((validatedQuery.currentPage - 1) * validatedQuery.perPage)
            .take(validatedQuery.perPage)
            .orderBy("tenant.id", "DESC")
            .getManyAndCount();
        return result;
        
  }

  async tenantByID(id: number) {
    const tenant = await this.tenantRepository.findOne({
      where: {
        id: id,
      },
    });
    return tenant;
  }


  async deleteTenant(id: number){
    await this.tenantRepository.delete(id);
    return {message: `Tenant with id ${id} is deleted successfully!`};

  }
}
