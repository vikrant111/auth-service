import express from 'express';


const router = express.Router();


router.post("/", (request, response)=>{
    response.status(201).json({})
})

export default router;