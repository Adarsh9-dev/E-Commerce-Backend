import express from "express";
import { addCart, getCart, deleteCart, updateCart } from "../controller/cartController.js";
import { Authentication } from '../middleware/authentication.js';
import { Autherisation } from '../middleware/autherisation.js';

const router = express.Router();

//Add Cart --------------------------------------
router.post('/users/:userId/cart', Authentication, Autherisation, addCart);

//Update Cart -----------------------------------
router.put('/users/:userId/cart', Authentication, Autherisation, updateCart);

//Show Cart -------------------------------------
router.get('/users/:userId/cart', Authentication, Autherisation, getCart);

//Delete Cart -----------------------------------
router.delete('/users/:userId/cart', Authentication, Autherisation, deleteCart)


export default router;