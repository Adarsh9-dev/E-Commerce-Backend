import express from "express";
import { createOrder, updateOrder } from "../controller/orderController.js";
import { Authentication } from '../middleware/authentication.js';
import { Autherisation } from '../middleware/autherisation.js';

const router = express.Router();

//Create Order --------------------------- 
router.post('/users/:userId/orders', Authentication, Autherisation, createOrder);

//Update Order ---------------------------
router.put('/users/:userId/orders', Authentication, Autherisation, updateOrder);


export default router;