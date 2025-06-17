import { Brackets, Repository } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import { LimitedUserData, UserData, UserQueryParams } from "../types";
import createHttpError from "http-errors";
import { Roles } from "../constants";
import bcrypt from "bcrypt";
import { Tenant } from "../entity/Tenant";

const saltRounds = 10;

export class UserService {
  constructor(private userRepository: Repository<User>) {}

  async create({ firstName, lastName, email, password, role, tenantId }: UserData) {
    const user = await this.userRepository.findOne({
        where: {email: email}
    });

    if(user){
        const err = createHttpError(400, "Email already exists!")
        throw err;
    }

    // If tenantId is provided, verify that the tenant exists
    if (tenantId) {
        const tenantRepository = AppDataSource.getRepository(Tenant);
        const tenant = await tenantRepository.findOne({
            where: { id: tenantId }
        });
        
        if (!tenant) {
            const err = createHttpError(400, `Tenant with ID ${tenantId} not found!`);
            throw err;
        }
    }

    //hash the password before storing it to database
    const hashedPassword = await bcrypt.hash(password, saltRounds, )
    try{
        return await this.userRepository.save({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role,
            tenant: tenantId ? { id: tenantId } : undefined,
        });
    }catch(err){
        const error = createHttpError(500, "Failed to store the data in database")
        throw err;
    }
  }


  async updateUser(
    userId: number,
    {
      firstName,
      lastName,
      role,
      email,
      tenantId
    }: LimitedUserData,
  ){
      try{
        return await this.userRepository.update(userId, {
          firstName,
          lastName,
          role,
          email,
          tenant: tenantId ? {id: tenantId} : undefined
        })
      }catch(err){
        const error = createHttpError(500, "Failed to update the user!");
        throw error;
      }
  }


   async usersList(validatedQuery: UserQueryParams) {
       const queryBuilder = this.userRepository.createQueryBuilder("user");

        if (validatedQuery.q) {
            const searchTerm = `%${validatedQuery.q}%`;
            queryBuilder.where(
                new Brackets((qb) => {
                    qb.where(
                        "CONCAT(user.firstName, ' ', user.lastName) ILike :q",
                        { q: searchTerm },
                    ).orWhere("user.email ILike :q", { q: searchTerm });
                }),
            );
        }

        if (validatedQuery.role) {
            queryBuilder.andWhere("user.role = :role", {
                role: validatedQuery.role,
            });
        }

        const result = await queryBuilder
            .leftJoinAndSelect("user.tenant", "tenant")
            .skip((validatedQuery.currentPage - 1) * validatedQuery.perPage)
            .take(validatedQuery.perPage)
            .orderBy("user.id", "DESC")
            .getManyAndCount();
        return result;
  }



  async findByEmail(email: string){
    const user = await this.userRepository.findOne({where:{
      email: email
    }})
    return user;
  }


  async findById(id: number) {
        return await this.userRepository.findOne({
            where: {
                id,
            },
            relations: {
                tenant: true,
            },
        });
    }


  async deleteById(userId: number){
    return await this.userRepository.delete(userId)
  }

}
