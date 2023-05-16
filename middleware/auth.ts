import { Request, Response, NextFunction } from "express"
import jwt, { Secret } from 'jsonwebtoken';
import ErrorHandler from "../utils/ErrorHandler";
import dbConnection from "../config/dbConnection";

export interface CustomRequest extends Request {
  user?: string | JwtPayload
}

interface JwtPayload {
  _id: string;

}

export const isAuthenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const driver = dbConnection()
    const session = driver.session({ database: "neo4j" });
    const { token } = req.cookies;
    if (!token) {
      return next(new ErrorHandler("Please Login to access this resource", 401));
    }
    const decodedData = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const result = await session.run(`match(t:User{_id:'${decodedData._id}'})return t`);
    const data2 = result.records.map(i => i.get('t').properties);
    (req as CustomRequest).user = decodedData;
    next();
  } catch (error: any) {
    return (next(new ErrorHandler(error, 401)))

  }
}