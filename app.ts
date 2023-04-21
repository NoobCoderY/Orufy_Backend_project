//All imports
import express from "express";
import dotenv from "dotenv";
import ProductRouter from "./routes/ProductsRoutes"
import { error } from "./middleware/errorMiddleWare";


//  env file import 
 dotenv.config({
    path: "./config/config.env",
  });

  const app =express();

  //**********************************Routes**********************************/

  app.use("/api/v1",ProductRouter)


 //**********************************error middleware**********************************/
  app.use(error)

 export default app;
