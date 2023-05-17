import express, { Request, Response } from "express";
import {
  createUser,
  delUser,
  loginuser,
  logout,
  updateUser,
} from "../controller/AuthController";
import { isAuthenticateUser } from "../middleware/auth";
import { body, validationResult } from "express-validator";
import { validationMiddleware } from "../middleware/errorMiddleWare";

const router = express.Router();

//**********************************Rest Api  End Point*********************************/

router.post( "/createUser",
  //check input validation
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email address"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password should be at least 6 characters long"),
  ],
  validationMiddleware,
  createUser
);
router.post( "/login",
  [
    //check input validation
    body("email").isEmail().withMessage("Invalid email address"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password should be at least 6 characters long"),
  ],
  validationMiddleware,
  loginuser
);
router.get("/logout", logout);
router.put( "/updateuser/:id",
  [
    //check input validation
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email address"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password should be at least 6 characters long"),
  ],
  validationMiddleware,
  updateUser
);
router.delete("/deleteuser/:id", delUser);

export default router;
