import express from "express";
import { PORT } from "./config/env.js";
import cookieParser from "cookie-parser";

import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';
import connectToDB from "./database/mongodb.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import arcjetMiddleware from "./middlewares/arcjet.middleware.js";
 

const app = express();

app.use(arcjetMiddleware);

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());


app.use("/api/v1/auth", authRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/subscriptions", subscriptionRouter)

app.use(errorMiddleware);

app.get("/", (req,res)=>{
    res.send("Do not worry about your subscriptions end dates.")
})

app.listen(PORT, async()=>{
    console.log("Subscription Tracker API is running on http://localhost:"+PORT);
    await connectToDB();
})


export default app;