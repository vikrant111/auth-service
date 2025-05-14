import app from "./app";
import { Config } from "./config";
import { AppDataSource } from "./config/data-source";
import logger from "./config/logger";


const startServer = async() => {
    try{
       const PORT = Config.PORT 
       await AppDataSource.initialize()
       logger.info("Database connected successfully")
       
       app.listen(PORT, ()=>{
        logger.info("Server listening on port... ", { port : PORT })
        // logger.info("Server listening on port ",PORT )
    })
    }catch(err){
        console.log("Error while starting server", err)
        process.exit(1)

    }
}

startServer();