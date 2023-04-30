//All imports
import express from "express";
import dotenv from "dotenv";
import AuthRouter from "./routes/AuthRoutes"
import { error } from "./middleware/errorMiddleWare";
import cookieParser from "cookie-parser"
import { graphqlHTTP } from "express-graphql";

//  env file import 
 dotenv.config({
    path: "./config/config.env",
  });

  const app =express();

  app.use(express.json());

  app.use(cookieParser())

  

  //**********************************Routes**********************************/

  app.use("/api/v1",AuthRouter)


 //**********************************error middleware**********************************/
  app.use(error)

 export default app;
