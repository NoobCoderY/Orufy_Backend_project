import mongoose,{connect} from "mongoose";

export const dbConnect=async()=>{
    let DBURI:any=process.env.MONGO_URI
    return await connect(DBURI).then(()=>{
        console.log(" DB connected");
    }).catch((err)=>{
        console.log(err);   
    })
    
}