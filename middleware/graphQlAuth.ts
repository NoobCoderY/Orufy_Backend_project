 import jwt, { Secret } from 'jsonwebtoken';
import dbConnection from "../config/dbConnection";


interface JwtPayload {
    _id: string;
  
  }
//**********************************middleware for authorization*********************************/

export const isAuthenticateUser=async(req:any)=>{
    try {
        const driver = dbConnection()
    const session = driver.session({ database: "neo4j" });
    const { token } = req.cookies;
    console.log(token,"c");
    if (!token) {
      throw new Error("Please Login to access this resource");
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
    const result = await session.run(`match(t:User{_id:'${decodedData._id}'})return t`);
    const data2 = result.records.map(i => i.get('t').properties);
    req.user = decodedData;
        
    } catch (error:any) {
        throw new Error(error)
        
    }

}