import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/userService";
import { CreateUserRequest, UpdateUserRequest, UserData, UserQueryParams } from "../types";
import { Roles } from "../constants";
import { matchedData, validationResult } from "express-validator";
import { add, Logger } from "winston";
import createHttpError from "http-errors";

export class UserController {
  constructor(
    private userService: UserService,
    private logger: Logger
  ) {}

  async create(
    request: CreateUserRequest,
    response: Response,
    next: NextFunction
  ) {
    const { firstName, lastName, email, password, tenantId, role } = request.body;

    try {
      const result = validationResult(request);
      if (!result.isEmpty()) {
        response.status(400).json({ errors: result.array() });
        return;
      }

      const user = await this.userService.create({
        firstName,
        lastName,
        email,
        password,
        role,
        tenantId,
      });

      response
        .status(201)
        .json({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        });


        
    } catch (err) {
      next(err);
    }
  }


  async updateUserData(request: UpdateUserRequest, response: Response, next: NextFunction){
          // In our project: We are not allowing user to change the email id since it is used as username
        // In our project: We are not allowing admin user to change others password

        //validation
        const result = validationResult(request);
        if(!result.isEmpty()){
          return response.status(400).json({error: result.array()})
        }

        const { firstName, lastName, role, email, tenantId } = request.body;
        const userId = request.params.id;

        if(isNaN(Number(userId))){
          next(createHttpError(400, "Invalid url params!"))
          return;
        }

        this.logger.debug("request for updating a user", request.body);

        try{
          await this.userService.updateUser(Number(userId), {
            firstName,
            lastName,
            email,
            role,
            tenantId
          })
            this.logger.info("user has been updated!", {id: userId});
            response.json({
              id: Number(userId),
              firstName,
              lastName,
              email,
              role,
              tenantId
             })
            
        }catch(err){
          next(err)
        }
  }


  
   async getUsersList(
    request: Request,
    response: Response,
    next: NextFunction
  ){
      const validatedQuery = matchedData(request, { onlyValidData: true });

    try {
      const [allUsers, count] = await this.userService.usersList( validatedQuery as UserQueryParams,);

      this.logger.info("Successfully listed users", allUsers)

      this.logger.info("All users have been fetched");
            response.json({
                currentPage: validatedQuery.currentPage as number,
                perPage: validatedQuery.perPage as number,
                total: count,
                data: allUsers,
            });
    } catch (err) {
      next(err);
    }

  }





  
   async getUserByID(
    request: Request,
    response: Response,
    next: NextFunction
  ){

    const userID = request.params.id;

    if(isNaN(Number(userID))){
      next(createHttpError(400, "Invalid url params!"))
    }

    try {
      const user = await this.userService.findById(Number(userID));

      if(!user){
        next(createHttpError(400, "User does not exists!"));
      }

      this.logger.info("Successfully found user", user)

      this.logger.info("All users have been fetched");
      response.json(user);
    } catch (err) {
      next(err);
    }

  }



  async deleteUserData(request:Request, response:Response, next:NextFunction){
    const userId = request.params.id;

    if(isNaN(Number(userId))){
      next(createHttpError(400, "Invalid url params!"));
      return;
    }
    try{
      await this.userService.deleteById(Number(userId));
      this.logger.info("User has been deleted!",{
        id: Number(userId)
      })
      response.json({
        message:"User has been deleted!",
        userId
      })

    }catch(err){
      next(err)
    }

  }




}
