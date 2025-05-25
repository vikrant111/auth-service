import { Repository } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import { UserData } from "../types";
import createHttpError from "http-errors";
import { Roles } from "../constants";
import bcrypt from "bcrypt";

const saltRounds = 10;

export class UserService {
  constructor(private userRepository: Repository<User>) {}

  async create({ firstName, lastName, email, password, role }: UserData) {
    const user = await this.userRepository.findOne({
        where: {email: email}
    });

    if(user){
        const err = createHttpError(400, "Email already exists!")
        throw err;
    }


    //hash the password before storing it to database
    const hashedPassword = await bcrypt.hash(password, saltRounds, )
    try{
        return await this.userRepository.save({ firstName, lastName, email, password:hashedPassword, role:role});
    }catch(err){
        const error = createHttpError(500, "Failed to store the data in database")
        throw err;
    }
    
  }


  async findByEmail(email: string){
    const user = await this.userRepository.findOne({where:{
      email: email
    }})
    return user;
  }


  async findById(id: number){
     const user = await this.userRepository.findOne({where:{
      id: id
    }})
    return user;
  }
}
