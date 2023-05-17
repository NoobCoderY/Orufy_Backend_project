import  express,{Request,Response,NextFunction}  from "express";
import { validationResult } from 'express-validator';

//**********************************Error middleware *********************************/

export const error=(err:any,req:Request,res:Response,next: NextFunction)=>{
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    res.status(err.statusCode).json({
        success:false,
        err:err.message
      })
}


//**********************************Express error handling middleware *********************************/

export const validationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
  } else {
    next();
  }
};
