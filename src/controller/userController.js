import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import "../config/awsConn.js";
import { uploadFile } from "../utils/helper/helper.js";
import { validReqBody, validEmail, validPhone, validPassword, validIsNumber, validObjectId } from "../utils/validator/validator.js";
import jwt from "jsonwebtoken";

export const userRegester = async (req, res) => {
  try {
    //Req body Checking -------------------------
    if (!validReqBody(req.body) || !req.body.address) {
      return res.status(400).json({status: false, message: "Data not exist"});
    }

    const saltRound = 10;
    req.body.address = JSON.parse(req.body.address);
    const file = req.files; //File Image Collection
    const {fname, lname, email, phone, password, address} = req.body; //Req body Data
    const {street, city, pincode} = address.shipping;
    const billingObj = {
      street1: address.billing.street,
      city1: address.billing.city,
      pincode1: address.billing.pincode
    }
    const { street1, city1, pincode1 } = billingObj;
    
    //Mandotory Field Checking -------------------
    if (!fname || !lname || !email || file.length === 0 || !phone || !password || !street || !city || !pincode || !street1 || !city1 || !pincode1) {
      return res.status(400).json({status: false, message: "Something is Missing"})
    }

    //Valid Email Checking -----------------------
    if (!validEmail(email)) {
      return res.status(400).json({status: false, message: "Invalid data"});
    }

    //Valid Phone Checking ------------------------
    if (!validPhone(phone)) {
      return res.status(400).json({status: false, message: "Invalid data"});
    }

    //Valid Password Checking ---------------------
    if (!validPassword(password)) {
      return res.status(400).json({status: false, message: "Invalid data"});
    }

    //PinCode no checking -------------------------
    if (!validIsNumber(pincode) || !validIsNumber(pincode1)) {
      return res.status(400).json({status: false, message: "Invalid data"}); 
    }

    //Extract +91|0 from phone ---------------------
    const correctPhone = phone.slice((phone.length - 10), phone.length);
    req.body.phone = correctPhone;

    //Phone & Email Unique Checking ---------------
    const isUnique = await User.find({$or: [{phone: correctPhone}, {email: email}]})

    if (isUnique.length > 0) {
      return res.status(400).json({status: false, message: "Data Exist"});
    }

    //Password Hashed ------------------------
    req.body.password = await bcrypt.hash(password, saltRound);

    //AWS Image Creation ---------------------
    const isImage =  await uploadFile(file[0]);
    
    // - Image Error -------------------------
    if (isImage.error) {
      return res.status(400).json({status: false, message: "Something went wrong"});
    }

    // - Successful Image Creation -----------
    req.body.profileImage = isImage;

    //User Creation ---------------------------
    const result = await User.create(req.body);

    if (!result) {
      return res.status(400).json({status: false, message: "Something went wrong"});
    }

    //Successful User Creation ----------------
    res.status(201).json({status: true, message: "User created successfully", data: result})
    
  } catch(err) {
    //Error Message ---------------------------
    res.status(500).json({status: false, message: err.message})
  }
}

export const userLogin = async (req,res) => {
  try {
    const {email, password} = req.body;
    
    //Req body Checking -------------------------
    if (!validReqBody(req.body)) {
      return res.status(400).json({status: false, message: "Invalid data"});
    }

    //Email & Password Present Checking ---------
    if (!email || !password) {
      return res.status(400).json({status: false, message: "Data is missing"})
    }

    //Valid Email Checking -----------------------
    if (!validEmail(email)) {
      return res.status(400).json({status: false, message: "Invalid data"});
    }

    //Valid Password Checking ---------------------
    if (!validPassword(password)) {
      return res.status(400).json({status: false, message: "Invalid data"});
    }

    //Finding User from MongoDb -------------------
    const findUser = await User.findOne({email: email});

    //User not Present ----------------------------
    if (!findUser) {
      return res.status(404).json({status: false, message: "User not exist"});
    }

    //Password Matching ---------------------------
    const passMatch = await bcrypt.compare(password, findUser.password);

    //Password Not Match --------------------------
    if (!passMatch) {
      return res.status(404).json({status: false, message: "User not exist"});
    }

    //Create token for 1hr ------------------------
    const token = jwt.sign({data: findUser._id}, process.env.JWT_SECRET_KEY, {expiresIn: '1h'})

    //Success Respond -----------------------------   
    res.status(200).json({status: true, message: "User login successfull", data: {userId: findUser._id, token: token}})
    
  } catch(err) {
    //Error Respond -------------------------------
    res.status(500).json({status: false, message: err.message});
  }
}

export const getUserProfile = async(req, res) => {
  try {
    //Collecting User Id ------------------------
    const userId = req.params.userId;

    //Valid Object Id Checking ------------------
    if (!validObjectId(userId)) {
      return res.status(400).json({status: false, message: "Invalid User Id"});
    }

    //Searching User ----------------------------
    const result = await User.findById(userId);
    
    //User not exist ----------------------------
    if (!result) {
      return res.status(404).json({status: false, message: "User not found"});
    }

    //Success Respond ----------------------------
    res.status(200).json({status: true, message: "User profile details", data: result});

  } catch(err) {
    //Failure Respond -----------------------------
    res.status(500).json({status: false, message: err.message})
  }
}

export const updateUser = async (req, res) => {
  try {
    const saltRound = 10;

    //Collecting User Id -----------------------------
    const userId = req.params.userId;
  
    //Valid User Id checking -------------------------
    if (!validObjectId(userId)) {
      return res.status(400).json({status: false, message: "Invalid User Id"});
    }
    
    //Finding User -----------------------------------
    const isUserExist = await User.findById(userId);
    //User Not Exist ---------------------------------
    if (!isUserExist) {
      return res.status(404).json({status: false, message: "User not exist"});
    }

    // File & Req.body not present -------------------
    if (!req.files && Object.keys(req.body).length === 0) {
      return res.status(400).json({status: false, message: "Data not exist"}); 
    }

    //Store updatable data ---------------------------
    const updateObj = {};

    //File Present -----------------------------------
    if (req.files.length > 0) {
      //Collect File ---------------------------------
      const file = req.files;
      //File Updload ---------------------------------
      const isImage = await uploadFile(file[0]);
      //File Not exist -------------------------------
      if (isImage.error) {
        return res.status(400).json({status: false, message: "Something went wrong"});
      }
      //Store Image URL ------------------------------
      updateObj.profileImage = isImage;
    }

    //Req Body data Present --------------------------
    if (Object.keys(req.body).length > 0) {
      //Collecting following data --------------------
      const {fname, lname, email, phone, password, address} = req.body;

      //Fname Exist ----------------------------------
      if (fname) {
        updateObj.fname = fname;
      }

      //Lname Exist ----------------------------------
      if (lname) {
        updateObj.lname = lname;
      }

      //Email Exist ----------------------------------
      if (email) {
        //Email Invalid ------------------------------
        if (!validEmail(email)) {
          return res.status(400).json({status: false, message: "Invalid data"});
        }
        //Store Email --------------------------------
        updateObj.email = email;
      }

      //Phone Exist ----------------------------------
      if (phone) {
        //Phone Invalid ------------------------------
        if (!validPhone(phone)) {
          return res.status(400).json({status: false, message: "Invalid data"});
        }
        //Extract +91|0 ------------------------------
        const correctPhone = phone.slice((phone.length - 10), phone.length);
        //Store Phone --------------------------------
        updateObj.phone = correctPhone;
      }

      //Password Exist -------------------------------
      if (password) {
        //Invalid Password ---------------------------
        if (!validPassword(password)) {
          return res.status(400).json({status: false, message: "Invalid data"});
        }
        //Password Hashing ---------------------------
        const newPassword = await bcrypt.hash(password, saltRound);
        //Password Store -----------------------------
        updateObj.password = newPassword;
      }

      //Address Exist --------------------------------
      if (address) {
        //Convert String to Object -------------------
        const newAddress = JSON.parse(address);

        //Shipping Checking --------------------------
        if (newAddress.shipping) {
          const {street, city, pincode} = newAddress.shipping;
          //Street present or not in req.body --------
          if (street) {
            newAddress.shipping.street = street
          } else {
            newAddress.shipping.street = isUserExist.address.shipping.street;
          }
          
          //City present or not in req.body --------
          if (city) {
            newAddress.shipping.city = city;
          } else {
            newAddress.shipping.city = isUserExist.address.shipping.city;
          }
  
          //pincode present or not in req.body --------
          if (pincode) {
            if (!validIsNumber(pincode)) {
              return res.status(400).json({status: false, message: "Invalid data"});
            }
            newAddress.shipping.pincode = pincode
          } else {
            newAddress.shipping.pincode = isUserExist.address.shipping.pincode; 
          }
        } else {
          newAddress.shipping = isUserExist.address.shipping
        }

        //Billing Checking --------------------------
        if (newAddress.billing) {
          const {street, city, pincode} = newAddress.billing;
          //Street present or not in req.body --------
          if (street) {
            newAddress.billing.street = street
          } else {
            newAddress.billing.street = isUserExist.address.billing.street;
          }

          //City present or not in req.body --------
          if (city) {
            newAddress.billing.city = city;
          } else {
            newAddress.billing.city = isUserExist.address.billing.city;
          }

          //pincode present or not in req.body --------
          if (pincode) {
            if (!validIsNumber(pincode)) {
              return res.status(400).json({status: false, message: "Invalid data"});
            }
            newAddress.billing.pincode = pincode
          } else {
            newAddress.billing.pincode = isUserExist.address.billing.pincode; 
          }
        } else {
          newAddress.billing = isUserExist.address.billing;
        }

        //Address Store ------------------------------
        updateObj.address = newAddress;
      }
  
      //Phone & Email Unique Checking ----------------
      if (phone && email) {
        const isPresent = await User.find({$or: [{phone: updateObj.phone, _id: {$ne: userId}}, {email: updateObj.email, _id: {$ne: userId}}]});
        
        //Not Unique ----------------------------------
        if (isPresent.length > 0) {
          return res.status(404).json({status: false, message: "User Exist.."});
        }
      }
      else if (phone) {
        const isPresent = await User.find({phone: updateObj.phone, _id: {$ne: userId}});
        
        //Not Unique ----------------------------------
        if (isPresent.length > 0) {
          return res.status(404).json({status: false, message: "User Exist.."});
        }
      }
      else if (email) {
        const isPresent = await User.find({email: updateObj.email, _id: {$ne: userId}});
        
        //Not Unique ----------------------------------
        if (isPresent.length > 0) {
          return res.status(404).json({status: false, message: "User Exist.."});
        }
      }
    }

    //UpdateObj Empty ---------------------------------
    if (Object.keys(updateObj).length === 0) {
      return res.status(400).json({status: false, message: "Nothing to Update"});
    }

    //Update User Details ------------------------------
    const result = await User.findByIdAndUpdate(userId, updateObj, {new: true})
    
    //Creation fault -----------------------------------
    if (!result) {
      return res.status(400).json({status: false, message: "Something going wrong"});
    }

    //Success Respond ----------------------------------- 
    res.status(200).json({status: true, message: "User profile updated", data: result});

  } catch(err) {
    //Error Respond --------------------------------------
    res.status(500).json({status: false, messaage: err.message});
  }
}