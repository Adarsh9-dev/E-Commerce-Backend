import User from "../models/userModel.js"

export const userRegester = async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.files);
    res.send(req.body);
    
  } catch(err) {
    //If any Error, send this
    res.status(500).json({status: false, message: err.message})
  }
}