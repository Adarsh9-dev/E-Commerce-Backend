import mongoose from "mongoose";
import User from "./userModel.js";
import Product from "./productModel.js";

const itemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: Product
    },
    quantity: {
      type: Number, 
      required: true
    }
  },
  {_id: false}
)

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: User
  },
  items: [itemSchema],
  totalPrice: {
    type: Number, 
    required: true
  },
  totalItems: {
    type: Number, 
    required: true
  }
},{timestamps: true});

export default new mongoose.model('Cart', cartSchema);