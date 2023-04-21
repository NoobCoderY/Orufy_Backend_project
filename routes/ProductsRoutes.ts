import  express,{Request,Response}  from "express";
import { createProduct } from "../controller/ProductController";


const router=express.Router();

router.get("/admin/createProduct",createProduct)
export default router;