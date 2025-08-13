import mongoose from "mongoose";
import { DB_NAME } from "../constans.js";

const connectDB = async () => {
    try{
        const connectionInstace = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`mongoDB connected || DB HOST: ${connectionInstace.connection.host}`);
        
    } catch(error){
        console.log("database connection error ", error);
        process.exit(1)
        
    }
}

export default connectDB