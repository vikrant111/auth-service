import { checkSchema } from "express-validator";

export default checkSchema({
  firstName: {
    notEmpty: {
      errorMessage: "First name is required!"
    },
    trim: true
  },

  lastName: {
    notEmpty: {
      errorMessage: "Last name is required!"
    },
    trim: true
  },

  email: {
    notEmpty: {
      errorMessage: "Email is required!"
    },
    isEmail: {
      errorMessage: "Must be a valid email address"
    },
    trim: true
  },

  password: {
    notEmpty: {
      errorMessage: "Password is required!"
    },
    // isLength: {
    //   options: { min: 8 },
    //   errorMessage: "Password must be at least 8 characters"
    // }
  },

  // role: {
  //   notEmpty: {
  //     errorMessage: "Role is required!"
  //   },
  //   trim: true
  // }
});
