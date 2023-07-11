import Product from "../models/productModel.js";
import "../config/awsConn.js";
import { uploadFile } from "../utils/helper/helper.js"
import { validReqBody, validIsNumber, validSize, validObjectId } from "../utils/validator/validator.js";

export const addProduct = async (req, res) => {
  try {
    //Req Body Empty -------------------------------
    if (!validReqBody(req.body)) {
      return res.status(400).json({status: false, message: "Empty Data"})
    }
      
    const file = req.files; //File data
    const {title, description, price, currencyId, currencyFormat, availableSizes, installments, isDeleted, isFreeShipping} = req.body;
    
    //Mandatory field checking ----------------------
    if (file.length === 0 || !title || !description || !price || !currencyId || !currencyFormat || !availableSizes) {
      return res.status(400).json({status: false, message: "Something is misssing"})
    }
    
    //Converting string to Spcific type -------------
    const sizes = req.body.availableSizes;
    req.body.availableSizes = sizes.split(',');
    const newAvalableSize = req.body.availableSizes;

    req.body.price = parseFloat(price);
    const newPrice = req.body.price;

    if (installments) {
      req.body.installments = parseInt(installments);
    }

    if (isDeleted) {
      req.body.isDeleted = isDeleted === "true" ? true : false;
    }

    if (isFreeShipping) {
      req.body.isFreeShipping = isFreeShipping === "true" ? true : false;
    }

    //Unique title checking -------------------------
    const isTitle = await Product.findOne({title: title, isDeleted: false});

    if (isTitle) {
      return res.status(400).json({status: false, message: "Data Exist"});
    }

    //Decimal | Number checking ---------------------
    if (!validIsNumber(newPrice)) {
      return res.status(400).json({status: false, message: "Formating Error"});
    }

    //Size checking ---------------------------------
    if (!validSize(newAvalableSize) || newAvalableSize.length === 0) {
      return res.status(400).json({status: false, message: "Formating Error"});
    }

    //File Upload ----------------------------------- 
    const filePath = await uploadFile(file[0]);
    
    //- File Upload error ---------------------------
    if (filePath.error) {
      return res.status(400).json({status: false, message: "File Upload Error"});
    }

    //- Store File path in Req body -----------------
    req.body.productImage = filePath;

    //Product Creation ------------------------------
    const result = await Product.create(req.body);

    //Product Creation Error ------------------------
    if (!result) {
      return res.status(400).json({status: false, message: "Something going wrong"});      
    }

    //Success Respond -------------------------------
    res.status(201).json({status: true, message: "Product created successfully", data: result})

  } catch(err) {
    //Error Respond ---------------------------------
    res.status(500).json({status: false, message: err.message});
  }
}

export const getAllProduct  = async (req, res) => {
  try {
    //Empty Req Query --------------------------------------
    if (Object.keys(req.query).length === 0) {
      const result = await Product.find({isDeleted: false});
      return res.status(200).json({status: true, message: "Success", data: result});
    }
    
    // Extracting from Req Query ---------------------------
    let {size, name, priceGreaterThan, priceLessThan, priceSort} = req.query;

    //Convert all String to Float | Integer ----------------
    priceGreaterThan = parseFloat(priceGreaterThan);
    priceLessThan = parseFloat(priceLessThan);
    priceSort = parseInt(priceSort);

    //Empty Object -----------------------------------------
    const searchObj = {
      isDeleted: false
    };
    
    //Size Present -----------------------------------------
    if (size) {
      searchObj.availableSizes={$in: [size]};
    }

    //Name Present -----------------------------------------
    if (name) {
      searchObj.title = name;
    }

    //Price Present ----------------------------------------
    if (priceGreaterThan && priceLessThan) {
      searchObj.price = {$gt: priceGreaterThan, $lt: priceLessThan };
    }
    else if (priceGreaterThan) {
      searchObj.price = {$gt: priceGreaterThan};
    }
    else if (priceLessThan) {
      searchObj.price = {$lt: priceLessThan};
    }

    let result;

    //Sorting Order ----------------------------------------
    if (priceSort) {
      if (priceSort === 1) {
        result = await Product.find(searchObj).sort({price: 1});
      }
      else if (priceSort === -1) {
        result = await Product.find(searchObj).sort({price: -1});
      }
    } else {
      result = await Product.find(searchObj);
    }

    //Success Respond ---------------------------------------
    res.status(200).json({status: true, message: "Successful", data: result})

  } catch(err) {
    //Error Respond -----------------------------------------
    res.status(500).json({status: false, message: err.message});
  }
}

export const getOneProduct = async (req,res) => {
  try {
    //Collect product Id ------------------------------
    const productId = req.params.productId;

    //Validate Product Id -----------------------------
    if (!validObjectId(productId)) {
      return res.status(400).json({status: false, message: "Invalid product Id"});
    }

    //Finding Product ---------------------------------
    const result = await Product.findOne({_id: productId, isDeleted: false});

    //Not Found ---------------------------------------
    if (!result) {
      return res.status(404).json({status: false, message: "Product not found"});
    }

    //Success Respond ---------------------------------
    res.status(200).json({status: false, message: "Successful", data: result});

  } catch(err) {
    //Error Respond -----------------------------------
    res.status(500).json({status: false, message: err.message});
  }
}

export const deleteProduct = async (req, res) => {
  try {
    //Collecting product id ---------------------------
    const productId = req.params.productId;

    //Validating Product id ---------------------------
    if (!validObjectId(productId)) {
      return res.status(400).json({status: false, message: "Invalid product Id"});
    }

    //Finding Product ---------------------------------
    const result = await Product.findOne({_id: productId, isDeleted: false});

    //Not Found ---------------------------------------
    if (!result) {
      return res.status(404).json({status: false, message: "Product not found"});
    }
    
    //Update Object -----------------------------------
    const deleteObj = {
      isDeleted: true,
      deletedAt: Date.now()
    }

    //Updating Product --------------------------------
    const updateData = await Product.findByIdAndUpdate(productId, deleteObj, {new: true})
    
    //Error during Updation ---------------------------
    if (!updateData) {
      return res.status(400).json({status: false, message: "Something going wrong"});
    }

    //Success Respond ---------------------------------
    res.status(200).json({status: true, message: "Product Deleted Successfully"});

  } catch(err) {
    //Error Respond -----------------------------------
    res.status(500).json({status: false, message: err.message});
  }
}

export const updateProduct = async (req, res) => {
  try {
    //Collecting Product Id -------------------------------
    const productId = req.params.productId;

    //Invalid Product Id ----------------------------------
    if (!validObjectId(productId)) {
      return res.status(400).json({status: false, message: "Invalid Id"});
    }
    
    //Product Exist Checking ------------------------------
    const isProductExist = await Product.findOne({_id: productId, isDeleted: false});

    //Product Not Exist -----------------------------------
    if (!isProductExist) {
      return res.status(404).json({status: false, message: "Product Not Exist"});
    }

    //Empty Data ------------------------------------------
    if (!validReqBody(req.body) && !req.files) {
      return res.status(400).json({status: false, message: "Nothing to update"});
    }

    //Empty Object ----------------------------------------
    const updateObj = {}

    //Update req file -------------------------------------
    if (req.files) {
      if (req.files.length > 0) {
        const file = req.files[0];
  
        const isImage = await uploadFile(file);
  
        if (isImage.error) {
          return res.status(400).json({staus: false, message: "File upload Error"});
        }
  
        updateObj.productImage = isImage;
      }
    }

    const {title, description, price, currencyId, currencyFormat, isFreeShipping, style, availableSizes, installments} = req.body;

    //Title Update -----------------------------------------
    if (title) {
      const isTitlePresent = await Product.findOne({title: title, isDeleted: false});

      if (isTitlePresent) {
        return res.status(400).json({status: false, message: "Title Exist"});
      }

      updateObj.title = title;
    }

    //Description Update ------------------------------------
    if (description) {
      updateObj.description = description;
    }

    //Price Update ------------------------------------------
    if (price) {
      const newPrice = parseFloat(price);

      //Decimal | Number checking ---------------------------
      if (!validIsNumber(newPrice)) {
        return res.status(400).json({status: false, message: "Formating Error"});
      }

      updateObj.price = newPrice;
    }

    //Currency Id Update ------------------------------------
    if (currencyId) {
      updateObj.currencyId = currencyId;
    }

    //Currency Format Update --------------------------------
    if (currencyFormat) {
      updateObj.currencyFormat = currencyFormat;
    }

    //IsFreeShipping Update ---------------------------------
    if (isFreeShipping) {
      const newShipping = isFreeShipping === 'true' ? true : false;
      updateObj.isFreeShipping = newShipping;
    }

    //Style Update ------------------------------------------
    if (style) {
      updateObj.style = style;
    }

    //Installment Update ------------------------------------
    if (installments) {
      const newInstallment = parseInt(installments);
      updateObj.installments = newInstallment;
    }

    //Avalable Size Update ----------------------------------
    if (availableSizes) {
      const newAvalableSize = availableSizes.split(',');

      if (!validSize(newAvalableSize) || newAvalableSize.length === 0) {
        return res.status(400).json({status: false, message: "Formating Error"});
      }
      
      updateObj.availableSizes = newAvalableSize;
    }

    //UpdateObj Empty ----------------------------------------
    if (Object.keys(updateObj).length === 0) {
      return res.status(400).json({status: false, message: "Nothing to Update"});
    }

    //Update Code --------------------------------------------
    const result = await Product.findByIdAndUpdate(productId, updateObj, {new: true});

    //Any Error ----------------------------------------------
    if (!result) {
      return res.status(400).json({status: false, message: "Something going wrong"});
    }

    //Success Respond ----------------------------------------
    res.status(200).json({status: true, message: "Product Update Successfully", data: result})

  } catch(err) {
    //Error Respond ------------------------------------------
    res.status(500).json({status: false, message: err.message});
  }
}