import express from "express";

const app = express();

app.get("/", (req,res)=>{
    res.send("Do not worry about your subscriptions end dates.")
})

app.listen(8080, ()=>{
    console.log("Subscription Tracker API is running on http://localhost:8080")
})


export default app;