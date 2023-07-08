import express from "express";
import { userRegester, getUserProfile, userLogin, updateUser } from "../controller/userController.js"
import { Authentication } from "../services/authentication.js";
import { Autherisation } from "../services/autherisation.js";

const router = express.Router();


//Register User ------------------------------------
router.post('/register', userRegester);

//Login User ---------------------------------------
router.post('/login', userLogin);

//Get User -----------------------------------------
router.get('/user/:userId/profile', Authentication, Autherisation, getUserProfile); //Authentication & Autherisation

//Update User --------------------------------------
router.put('/user/:userId/profile', Authentication, Autherisation, updateUser); //Authentication & Autherisation

export default router