import dotenv from 'dotenv';
dotenv.config();
import connectDB from "./db/index.js";
import { app } from './app.js';
connectDB()
.then(()=> {
    app.listen(process.env.PORT || 3000, () => {
        console.log(`app is running on port : ${process.env.PORT}`)
    })
}).catch((err) => {
    console.log("Mongo DB connection failed !!", err)
})