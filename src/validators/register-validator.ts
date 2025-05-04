import { checkSchema } from "express-validator";

export default checkSchema({
  email: {
    notEmpty: true,
    errorMessage: "Email is required!",
    trim: true
    },
});
