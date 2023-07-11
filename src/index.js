import express from "express";
import cors from "cors";
import "dotenv/config";
import "./config/dbConn.js";
import multer from "multer";
import userRoute from "./routes/userRoutes.js";
import productRoute from "./routes/productRoutes.js";
import cartRoute from "./routes/cartRoutes.js";

const app = express();
const Port = process.env.PORT || 8080;

//Global Middlewares -------------------------------------
app.use(express.json())
app.use(express.urlencoded({extended: false}));
app.use(cors());
app.use(multer().any())

//Spliting Routes ---------------------------------
app.use('/', userRoute);
app.use('/', productRoute);
app.use('/', cartRoute);

//Server started ----------------------------------
app.listen(Port, ()=> {
  console.log(`Server is running on Port ${Port}`);
})