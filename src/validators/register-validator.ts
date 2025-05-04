import { body } from "express-validator";

export default  [
            body("email").notEmpty().withMessage("email is required!"),
            body("firstName").notEmpty().withMessage("firstName is required!"),
        ]
