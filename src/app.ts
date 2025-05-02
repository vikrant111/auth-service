import express from "express";
const app = express();


app.get("/", (req, res)=>{
     res.send("welcome to authn service")
})


export default app;

