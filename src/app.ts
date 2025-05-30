import "reflect-metadata"
import express, { NextFunction, Request, Response } from "express";
import logger from "./config/logger";
import createHttpError, { HttpError } from "http-errors";
import path from "path";
import cookieParser from "cookie-parser";


import authRouter from "./routes/auth";
import tenantRouter from "./routes/tenants";
import userRouter from "./routes/user";




const app = express();
app.use(express.static('public', { dotfiles: 'allow' }));

app.use(cookieParser())
app.use(express.json());



app.get("/", (req, res)=>{
     res.status(200).send("welcome to authn service")
})




app.use("/auth", authRouter)

app.use("/tenants", tenantRouter)

app.use("/users", userRouter)




app.put('/tenants', (req, res) => {
  res.status(400).json({ error: "Tenant ID is required in the URL. Use /tenants/:id" });
});
app.delete('/tenants', (req, res) => {
  res.status(400).json({ error: "Tenant ID is required in the URL. Use /tenants/:id" });
});


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

