import app from "./app"
import { dbConnect } from "./config/dbConnection";

dbConnect();

app.listen(process.env.PORT,()=>{
    console.log(`server is running on ${process.env.PORT}`);
    
});