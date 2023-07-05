import express from "express";
import { userRegester } from "../controller/userController.js"

const router = express.Router();


//Register User ------------------------------------
router.post('/register', userRegester);

//Login User ---------------------------------------
// router.post('/login', );

//Get User -----------------------------------------
// router.get('/user/:userId/profile', ); //Authentication

//Update User --------------------------------------
// router.put('/user/:userId/profile', ); //Authentication & Autherisation

export default router