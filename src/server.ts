import app from "./app";
import { Config } from "./config";


const startServer = () => {
    try{
       const port = Config.PORT 
       app.listen(port, ()=>{
        console.log("Listening on PORT", port)
    })
    }catch(err){
        console.log("Error while starting server", err)
        process.exit(1)

    }
}

startServer();