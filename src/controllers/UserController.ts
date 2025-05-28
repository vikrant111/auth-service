import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/userService";
import { CreateUserRequest, UserData } from "../types";
import { Roles } from "../constants";
import { validationResult } from "express-validator";

export class UserController {
  constructor(private userService: UserService) {}

  async create(
    request: CreateUserRequest,
    response: Response,
    next: NextFunction
  ) {
    const { firstName, lastName, email, password } = request.body;

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
        role: Roles.MANAGER,
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
}
