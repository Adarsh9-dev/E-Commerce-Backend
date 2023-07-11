import express from "express";
import { addProduct, getOneProduct, deleteProduct, getAllProduct, updateProduct } from "../controller/productController.js"

const router = express.Router();

//Add Product ----------------------------------
router.post('/products', addProduct);

//Show Products --------------------------------
router.get('/products', getAllProduct);

//Show One Product -----------------------------
router.get('/products/:productId', getOneProduct);

//Update Product -------------------------------
router.put('/products/:productId', updateProduct);

//Delete Product -------------------------------
router.delete('/products/:productId', deleteProduct);

export default router;