import express from "express";
import { userRegester, getUserProfile, userLogin, updateUser } from "../controller/userController.js"
import { Authentication } from "../middleware/authentication.js";
import { Autherisation } from "../middleware/autherisation.js";

const router = express.Router();

//Register User ------------------------------------
router.post('/register', userRegester);

//Login User ---------------------------------------
router.post('/login', userLogin);

//Get User -----------------------------------------
router.get('/user/:userId/profile', Authentication, Autherisation, getUserProfile); 

//Update User --------------------------------------
router.put('/user/:userId/profile', Authentication, Autherisation, updateUser); 


export default router