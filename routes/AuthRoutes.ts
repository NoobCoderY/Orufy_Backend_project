import  express,{Request,Response}  from "express";
import { createUser, delUser, loginuser, logout, updateUser } from "../controller/AuthController";
import { isAuthenticateUser } from "../middleware/auth";


const router=express.Router();
//**********************************Rest Api  End Point*********************************/

router.post("/createUser",createUser)
router.post("/login",loginuser)
router.get("/logout",logout)
router.put("/updateuser/:id",updateUser)
router.delete("/deleteuser/:id",delUser)


export default router;