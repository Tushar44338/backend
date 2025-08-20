import dotenv from 'dotenv'
import connectDB from './db/index.js';
import { app } from './app.js';

dotenv.config({
    path: '../.env'
})

connectDB()
.then(()=>{
    app.on("error", (error) => {
        console.log("error: ", error);
        
    })
    app.listen(process.env.PORT || 3000, () => {
        console.log(`app is running on serveer: ${process.env.PORT}`);

    })
})
.catch((error) => {
    console.log("Database connection failed ", error);
})









/*
;( async () => {
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error", (error) => {
            console.log("ERRROR:", error);
            throw error 
            
        })
        app.listen(process.env.PORT, () => {
            console.log(`app is listening on ${process.env.PORT}`);
            
        })

    } catch(error) {
        console.error("ERROR: ", error)
        throw error
    }
})() */