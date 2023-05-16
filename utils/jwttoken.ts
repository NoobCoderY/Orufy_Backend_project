import jwt, { Secret, JwtPayload } from 'jsonwebtoken';

interface user{
    _id:string,
    name:string,
    email?:string,
    password?:string
}

//**********************************Genrate JWT*********************************/

export const getJwt=(user:user)=>{
  const token=jwt.sign(user,process.env.JWT_SECRET!)

  
  return token;
}

