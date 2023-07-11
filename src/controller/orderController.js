import User from "../models/userModel.js";
import Cart from "../models/cartModel.js";
import Order from "../models/orderModel.js";
import { validReqBody, validObjectId } from "../utils/validator/validator.js";

export const createOrder = async(req, res) => {
  try {
    //Collecting UserId ---------------------------
    const { userId } = req.params;

    //Valid Id Checking ---------------------------
    if (!validObjectId(userId)) {
      return res.status(400).json({
        status: false,
        message: "Invalid Id"
      })
    }

    //User Exist Checking -------------------------
    const isUser = await User.findById(userId);

    //Useer not Exist -----------------------------
    if (!isUser) {
      return res.status(404).json({
        status: false,
        message: "User not Exist"
      })
    }

    //Cart Exist Checking -------------------------
    const isCart = await Cart.findOne({userId});

    //Cart not Exist ------------------------------
    if (!isCart) {
      return res.status(404).json({
        status: false,
        message: "Cart not Exist"
      })
    }

    //Cart Empty ----------------------------------
    if (isCart.items.length === 0) {
      return res.status(400).json({
        status: false,
        message: "Cart not Exist"
      })
    }

    let totalQuantity = 0;

    //Storing Total Quantity ----------------------
    isCart.items.map((index)=> {
      totalQuantity += index.quantity;
    })

    //Order Obj -----------------------------------
    const orderObj = {
      userId: userId,
      items: isCart.items,
      totalPrice: isCart.totalPrice,
      totalItems: isCart.totalItems,
      totalQuantity: totalQuantity,
    }

    //Order Created -------------------------------
    const result = await Order.create(orderObj);

    //Cart Empty After Order ----------------------
    isCart.items = [];
    isCart.totalPrice = 0;
    isCart.totalItems = 0;

    //Update Cart ---------------------------------
    await Cart.findByIdAndUpdate(isCart._id, isCart, {new: true});

    //Success Respond -----------------------------
    res.status(201).json({
      status: true,
      message: "Order Created Successfully",
      data: result
    })

  } catch(err) {
    //Error Respond -------------------------------
    res.status(500).json({
      status: false, 
      message: err.message
    })
  }
}


export const updateOrder = async (req, res) => {
  try {
    //Req body not Empty -------------------------
    if (!validReqBody(req.body)) {
      res.status(400).json({
        status: false,
        message: "Empty Body"
      })
    }

    //Collecting User Id -------------------------
    const { userId } = req.params;

    //Validate User Id ---------------------------
    if (!validObjectId(userId)) {
      return res.status(400).json({
        status: false,
        message: "Invalid Id"
      })
    }

    //User Exist Checking ------------------------
    const isUser = await User.findById(userId);

    //User Not exist -----------------------------
    if (!isUser) {
      return res.status(404).json({
        status: false,
        message: "User not Exist"
      })
    }

    //Extracting OrderId and Status -------------
    const { orderId, status } = req.body;

    //If One of them not exist ------------------
    if (!orderId || !status) {
      return res.status(400).json({
        status: false,
        message: "Something is Missing"
      })
    }    

    //Valid Order Id ----------------------------
    if (!validObjectId(orderId)) {
      return res.status(400).json({
        status: false,
        message: "Invalid Id"
      })
    }

    //Order exist checking ----------------------
    const isOrder = await Order.findOne({_id: orderId, isDeleted: false, status: {$ne: "cancled"}});

    //Order not exist ---------------------------
    if (!isOrder) {
      return res.status(404).json({
        status: false,
        message: "Order not Exist"
      })
    }

    //Valid Order Checking ----------------------
    if (JSON.stringify(isOrder.userId) !== JSON.stringify(userId)) {
      return res.status(400).json({
        status: false,
        message: "Order not exist"
      })
    }

    //Invalid Status ----------------------------
    if (!["pending", "completed", "cancled"].includes(status)) {
      return res.status(400).json({
        status: false,
        message: "Status Invalid"
      })
    }

    //Checking cancellable ----------------------
    if (status === "cancled" && !isOrder.cancellable) {
      return res.status(400).json({
        status: false,
        message: "Cancel Not Possible"
      })
    }

    //Change Status -----------------------------
    isOrder.status = status;

    //Update Order ------------------------------
    const result = await Order.findByIdAndUpdate(orderId, isOrder, {new: true});

    //Success Respond ---------------------------
    res.status(200).json({
      status: true,
      message: "Status Successfully Updated",
      data: result
    })

  } catch(err) {
    //Error Respond -----------------------------
    res.status(500).json({
      status: false,
      message: err.message
    })
  }
}