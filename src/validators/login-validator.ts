import { checkSchema } from "express-validator";

export default checkSchema({
  email: {
    notEmpty: true,
    errorMessage: "Email is required!",
    trim: true
    },

  password:{
    trim: true,
    errorMessage: "Last name is required!",
    notEmpty: true,
    // isLength: {
    //     options:{
    //         min: 0
    //     },
    //     errorMessage: "Password length should be at least 8 chars."
    // }
  }
});
