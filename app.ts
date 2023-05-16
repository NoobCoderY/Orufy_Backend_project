//All imports
import express from "express";
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

 
  //**********************************GraphQL API Routes**********************************/

app.use(
  '/graphql',
  cookieParser(),
  graphqlHTTP((req, res) => ({
     schema,
     graphiql: true,
     context: {
      req:req, 
      res: res,
    },
  }))
);

  //**********************************REST API Routes**********************************/

  app.use("/api/v1",AuthRouter)


 //**********************************error middleware**********************************/

  app.use(error)

 export default app;
