import mongoose from 'mongoose'
import app from './app'
import config from "./config/index"


(async()=>{
    try {
        await mongoose.connect(config.MONGODB_URL)
        console.log("DB connected");
        app.on('error',(err)=> {
            console.log("ERROR ",err);
            throw err;

           

        })

        const onListning = ()=>{
            console.log(`listining at ${config.PORT}`)
                
        }
        app.listen(config.PORT,onListning)


    } catch (err) {
        console.log("ERROR ",err);
        throw err

        
    }
})()