import dotenv from 'dotenv';
dotenv.config(
      {path: './.env'}
);
import connectDB from "./db/index.js";
import { app } from './app.js';

console.log("CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY);
console.log("CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET);
connectDB()
.then(()=> {
    app.listen(process.env.PORT || 3000, () => {
        console.log(`app is running on port : ${process.env.PORT}`)
    })
}).catch((err) => {
    console.log("Mongo DB connection failed !!", err)
})