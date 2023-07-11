import mongoose from "mongoose";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";

const itemSchema = new mongoose.Schema({
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: Product
  },
  quantity: {
    type: Number, 
    required: true
  }
},{_id: false});

const orderSchema = new mongoose.Schema({
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
    },
    totalQuantity: {
      type: Number, 
      required: true
    },
    cancellable: {
      type: Boolean, 
      default: true
    },
    status: {
      type: String, 
      default: "pending"
    },
    deletedAt: {
      type: Date, 
      default: null
    }, 
    isDeleted: {
      type: Boolean, 
      default: false
    }
},{timestamps: true})

export default new mongoose.model('Order',orderSchema);