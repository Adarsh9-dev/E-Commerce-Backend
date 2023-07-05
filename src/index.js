import express from "express";
import cors from "cors";
import "dotenv/config";
import "./config/dbConn.js";
import centerRoute from "./routes/userRoutes.js";
import multer from "multer";

const app = express();
const Port = process.env.PORT || 8080;

//Global Middlewares -------------------------------------
app.use(express.json())
app.use(express.urlencoded({extended: false}));
app.use(cors());
app.use(multer().any())

//Spliting Routes ---------------------------------
app.use('/', centerRoute);

//Server started ----------------------------------
app.listen(Port, ()=> {
  console.log(`Server is running on Port ${Port}`);
})