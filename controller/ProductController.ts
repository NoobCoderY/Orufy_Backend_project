import  express,{Request,Response,NextFunction}  from "express";
import ErrorHandler from "../utils/ErrorHandler";

 export const createProduct=async(req:Request,res:Response,next:NextFunction)=>{

    try {
        
        
    } catch (error:any) {

        return (next(new ErrorHandler(error,401)))
        
    }

}