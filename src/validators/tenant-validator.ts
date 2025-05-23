import { checkSchema } from "express-validator";

export default checkSchema({
  name: {
    notEmpty: true,
    errorMessage: "Name is required!",
    trim: true
    },

  address:{
    trim: true,
    errorMessage: "Address is required!",
    notEmpty: true,
    // isLength: {
    //     options:{
    //         min: 0
    //     },
    //     errorMessage: "Password length should be at least 8 chars."
    // }
  }
});
