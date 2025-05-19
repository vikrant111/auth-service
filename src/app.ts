import "reflect-metadata"
import express, { NextFunction, Request, Response } from "express";
import logger from "./config/logger";
import createHttpError, { HttpError } from "http-errors";
import path from "path";
import cookieParser from "cookie-parser";


import authRouter from "./routes/auth";



const app = express();
app.use(express.static('public', { dotfiles: 'allow' }));

app.use(cookieParser())
app.use(express.json());



app.get("/", (req, res)=>{
     res.status(200).send("welcome to authn service")
})


app.use("/auth", authRouter)







//adding a global error handler middleware should always be kept at last
app.use((err:HttpError, req: Request, res: Response, next: NextFunction)=>{
    logger.error(err.message);
    const statusCode = err.statusCode || err.status || 500;
    res.status(statusCode).json({
        errors:[
            {
                type: err.name,
                msg: err.message,
                path: "",
                location: ""
            }
        ]
    })
})


export default app;

