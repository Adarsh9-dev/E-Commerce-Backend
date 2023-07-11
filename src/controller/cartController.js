import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import Cart from "../models/cartModel.js";
import { validReqBody, validIsNumber, validObjectId } from "../utils/validator/validator.js";


export const addCart = async (req, res) => {
  try {
    //Req Body Checing  --------------------------
    if (!validReqBody(req.body)) {
      return res.status(400).json({status: false, message: "Empty Req body"});
    }

    //Collecting UserId --------------------------
    const userId = req.params.userId;

    //Valid UserId Check -------------------------
    if (!validObjectId(userId)) {
      return res.status(400).json({status: false, message: "Invalid Id"});
    }

    //User Exist Check ---------------------------
    const isUserExist = await User.findById(userId);

    //Not User Present ---------------------------
    if (!isUserExist) {
      return res.status(404).json({status: false, message: "User not Exist"});
    }

    //Cart Exist Check ---------------------------
    const cartId = await Cart.findOne({userId: userId})

    let { productId, quantity} = req.body;

    //ProductId and Quantity Check ---------------
    if (!productId || !quantity) {
      return res.status(400).json({status: false, message: "Missing Item"});
    }

    //Convert quantity to Integer ----------------
    quantity = parseInt(quantity);
    if (quantity <= 0 || !validIsNumber(quantity)) {
      return res.status(400).json({status: false, message: "Invalid Quantity"});
    }

    //Product Exist Checking ---------------------
    const isProductExist = await Product.findOne({_id: productId, isDeleted: false});

    //Product Not Present ------------------------
    if (!isProductExist) {
      return res.status(404).json({status: false, message: "Product not exist"});
    }

    //Cart not exist -----------------------------
    if (!cartId) {
      const CartObj = {
        userId: userId,
        items: [{
          productId: productId,
          quantity: quantity
        }],
        totalPrice: isProductExist.price * quantity,
        totalItems: 1
      }

      //Creating a Cart --------------------------
      const result = await Cart.create(CartObj);
      
      //Respond Message --------------------------
      return res.status(201).json({status: true, message: "Cart Added Successfully", data: result})
    }
    
    //Cart exist & Handel Repeated Product -------
    let flag = 0;

    cartId.items.map((index) => {
      if (JSON.stringify(index.productId) === JSON.stringify(productId)) {
        flag = 1;
        index.quantity += quantity;
      }
    })

    //Repeated Product Present -------------------
    if (flag === 1) {
      cartId.totalPrice += (isProductExist.price * quantity);

      //Update Cart ------------------------------
      const updateCart = await Cart.findByIdAndUpdate(cartId._id, cartId, {new: true});
      
      //Respond Structure ------------------------
      return res.status(201).json({status: true, message: "Cart Added Successfully", data: updateCart})
    }

    //Unique Product -----------------------------
    const cartObj = {
      items: [
        ...cartId.items,
        {
          productId: productId,
          quantity: quantity
        }
      ],
      totalPrice: (isProductExist.price * quantity) + cartId.totalPrice,
      totalItems: cartId.totalItems + 1
    }

    //Update Cart -------------------------------
    const updateCart = await Cart.findByIdAndUpdate(cartId, cartObj, {new: true});

    //Respond Message ---------------------------
    return res.status(201).json({status: true, message: "Cart Added Successfully", data: updateCart})

  } catch(err) {
    //Error Message -----------------------------
    res.status(500).json({status: false, message: err.message});
  }
}

export const getCart = async (req, res) => {
  try {
    //Collecting UserId -------------------------
    const userId = req.params.userId;

    //Validate UserId ---------------------------
    if (!validObjectId(userId)) {
      return res.status(400).json({status: false, message: "Invalid Id"});
    }

    //Search User -------------------------------
    const isUserExist = await User.findById(userId);

    //User Not exist ----------------------------
    if (!isUserExist) {
      return res.status(404).json({status: false, message: "User not exist"});
    }
    
    //Search Cart -------------------------------
    const isCartExist = await Cart.findOne({userId});
    
    //Cart Not exist ----------------------------
    if (!isCartExist) {
      return res.status(404).json({status: false, message: "Cart not exist"});
    }
    
    //Item Not exist ----------------------------
    if (isCartExist.items.length === 0) {
      return res.status(400).json({status: false, message: "Cart not exist"});
    }

    //Success Respond ---------------------------
    res.status(200).json({status: false, message:"Success", data: isCartExist});

  } catch(err) {
    //Error Respond -----------------------------
    res.status(500).json({status: false, message: err.message});
  }
}

export const deleteCart = async (req, res) => {
  try {
    //Collecting UserId -------------------------
    const userId = req.params.userId;

    //Validate UserId ---------------------------
    if (!validObjectId(userId)) {
      return res.status(400).json({status: false, message: "Invalid Id"});
    }

    //Search User -------------------------------
    const isUserExist = await User.findById(userId);

    //User Not exist ----------------------------
    if (!isUserExist) {
      return res.status(404).json({status: false, message: "User not exist"});
    }

    //Search Cart -------------------------------
    const isCartExist = await Cart.findOne({userId});

    //Cart Not exist ----------------------------
    if (!isCartExist) {
      return res.status(404).json({status: false, message: "Cart not exist"});
    }

    //Item Not exist ----------------------------
    if (isCartExist.items.length === 0) {
      return res.status(400).json({status: false, message: "Cart not exist"});
    }

    //Update Document ---------------------------
    isCartExist.items = [];
    isCartExist.totalItems = 0;
    isCartExist.totalPrice = 0;

    //Update ------------------------------------
    const updateObj = await Cart.findByIdAndUpdate(isCartExist._id, isCartExist, {new: true})

    //Any Error ---------------------------------
    if (!updateObj) {
      return res.status(400).json({status: false, message: "Something going Wrong"});      
    }

    //Success Respond ----------------------------
    res.status(200).json({status: false, message: "Deleted Successfully"});

  } catch(err) {
    //Error Respond ------------------------------
    res.status(500).json({status: false, message: err.message});
  }
}

export const updateCart = async (req, res) => {
  try {
    //Req Body Checing  --------------------------
    if (!validReqBody(req.body)) {
      return res.status(400).json({status: false, message: "Empty Req body"});
    }

    //Collecting UserId --------------------------
    const userId = req.params.userId;

    //Valid UserId Check -------------------------
    if (!validObjectId(userId)) {
      return res.status(400).json({status: false, message: "Invalid Id"});
    }

    //User Exist Check ---------------------------
    const isUserExist = await User.findById(userId);

    //Not User Present ---------------------------
    if (!isUserExist) {
      return res.status(404).json({status: false, message: "User not Exist"});
    }

    //Cart Exist Check ---------------------------
    const cartId = await Cart.findOne({userId: userId})

    //Cart not Exist -----------------------------
    if (!cartId) {
      return res.status(404).json({status: false, message: "Cart not Exist"});
    }

    //Cart Empty ---------------------------------
    if (cartId.items.length === 0) {
      return res.status(400).json({status: false, message: "Cart not Exist"}); 
    }

    //Extracting from Body -----------------------
    const {productId, removeProduct} = req.body;
    
    //Converting string to Integer ---------------
    const removeKey = parseInt(removeProduct);

    //product Id and removeProduct not exist -----
    if (!productId || !removeProduct) {
      return res.status(400).json({status: false, message: "Missing item"}); 
    }

    //Product Exist checking ---------------------
    const isProductExist = await Product.findOne({_id: productId, isDeleted: false});

    //Product not Exist --------------------------
    if (!isProductExist) {
      return res.status(404).json({status: false, message: "Product not Exist"});
    }
    
    //Delete product from Cart Item -------------- 
    if (removeKey === 0) {
      //Collecting delete product index and Price 
      let deleteIndex = -1;
      let deletePrice = 0;

      cartId.items.map((index,key)=> {
        if (JSON.stringify(index.productId) === JSON.stringify(productId)) {
          deleteIndex = key;
          deletePrice = isProductExist.price * index.quantity;
        }
      })

      //Product not exist ------------------------
      if (deleteIndex === -1) {
        return res.status(400).json({status: false, message: "Product Not exist in Cart"}); 
      }


      cartId.items.splice(deleteIndex, 1);
      cartId.totalItems -= 1;
      cartId.totalPrice -= deletePrice;

      //Update Cart by deleting productId --------
      const updateObj = await Cart.findByIdAndUpdate(cartId._id, cartId, {new: true});

      //Success Respond --------------------------
      return res.status(200).json({status: true, message: "Cart Update Successfully", data: updateObj})
    }
    //Reduce quantity of the Product -------------
    else if (removeKey === 1) {
      //Collecting delete product index ----------
      let deleteIndex = -1;

      cartId.items.map((index,key)=> {
        if (JSON.stringify(index.productId) === JSON.stringify(productId)) {
          deleteIndex = key;
        }
      })

      //Product Not exist ------------------------
      if (deleteIndex === -1) {
        return res.status(400).json({status: false, message: "Product Not exist in Cart"}); 
      }

      cartId.items[deleteIndex].quantity -= 1;
      cartId.totalPrice -= isProductExist.price;
      
      if (cartId.items[deleteIndex].quantity === 0) {
        cartId.items.splice(deleteIndex, 1);
        cartId.totalItems -= 1;
      }

      //Update Cart by reducing productId ---------
      const updateObj = await Cart.findByIdAndUpdate(cartId._id, cartId, {new: true});

      return res.status(200).json({status: true, message: "Cart Update Successfully", data: updateObj})

    }
    //Invalid Remove Key --------------------------
    else {
      return res.status(400).json({status: false, message: "Invalid Remove key"}); 
    }

  }catch(err) {
    //Error Respond -------------------------------
    res.status(500).json({status: false, message: err.message})
  }
}