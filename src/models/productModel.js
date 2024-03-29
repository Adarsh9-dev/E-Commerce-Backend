import mongoose from "mongoose";

const productSchema = new mongoose.Schema ({ 
  title: {
    type: String, 
    required: true
  },
  description: {
    type: String, 
    required: true
  },
  price: {
    type: Number, 
    required: true
  },
  currencyId: {
    type: String, 
    required: true
  },
  currencyFormat: {
    type: String, 
    required: true
  },
  isFreeShipping: {
    type: Boolean, 
    default: false
  },
  productImage: {
    type: String, 
    required: true
  }, 
  style: {
    type: String
  },
  availableSizes: [
    {
      type: String, 
      required: true
    }
  ],
  installments: {
    type: Number
  },
  deletedAt: {
    type: Date, 
    default: null
  }, 
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {timestamps: true})

export default new mongoose.model('Product', productSchema);