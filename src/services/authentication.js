import jwt from "jsonwebtoken";

export const Authentication = async (req, res, next) => {
  try {
    //Collecting token from Req Headers ----------------------
    const token = req.headers['x-api-key'];

    //Token not present --------------------------------------
    if (!token) {
      return res.status(400).json({status: false, message: "Token not present"});
    }

    //Token Verify Checking -----------------------------------
    const isVerified = await jwt.verify(token, process.env.JWT_SECRET_KEY);

    //Invalid  Token ------------------------------------------
    if (!isVerified) {
      return res.status(400).json({status: false, message: "Invalid Token"});
    }

    //Storing payload data -------------------------------------
    req.decodeedData = isVerified.data;

    //next middleware | Router handeler ------------------------
    next();

  } catch(err) {
    //Error Respond ---------------------------------------------
    res.status(500).json({status: false, message: err.message});
  }
}