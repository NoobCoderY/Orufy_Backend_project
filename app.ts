//All imports
import express ,{Request}from "express";
import dotenv from "dotenv";
import AuthRouter from "./routes/AuthRoutes"
import { error } from "./middleware/errorMiddleWare";
import cookieParser from "cookie-parser"
import { graphqlHTTP } from "express-graphql";
import schema from "./schema/schema";
import cors from "cors";


//  env file import 
 dotenv.config({
    path: "./config/config.env",
  });
  const app =express();
  //**********************************Cross Origin*********************************/

app.use(cors({
  credentials: true,
  origin:"http://localhost:3000",
}))
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}))

app.use(cookieParser())


// Middleware to parse cookies
// app.use((req:Request, res, next) => {
//   const cookies = req.headers.cookie;
//   console.log(cookies,"12");
//   console.log(req.cookies,"13");
//   next()
  
// });
 
  //**********************************GraphQL API Routes**********************************/
app.use(
  '/graphql',
  cookieParser(),
  // cors ({ credentials: true, origin: "http://localhost:3000" }),
  graphqlHTTP((req, res,getAuthUser) => ({
     schema,
     graphiql: true,
     context: {
      req:req, 
      res: res,
      getAuthUser:getAuthUser
     
      
    },
  }))
);

  //**********************************REST API Routes**********************************/

  app.use("/api/v1",AuthRouter)


 //**********************************error middleware**********************************/
  app.use(error)

 export default app;
