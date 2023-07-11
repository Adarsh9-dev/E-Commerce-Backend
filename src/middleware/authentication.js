import jwt from "jsonwebtoken";

export const Authentication = async (req, res, next) => {
  try {
    //Checking header Present or not ------------------------
    if (!req.headers.authorization) {
      return res.status(400).json({status: false, message: "Token not Present in Header"});
    }

    //Collecting token from Req Headers ----------------------
    const token = req.headers.authorization.split(' ')[1];

    //Token not present --------------------------------------
    if (!token) {
      return res.status(400).json({status: false, message: "Token not present"});
    }

    //Token Verify Checking -----------------------------------
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
      //Invalid  Token ------------------------------------------
      if (err) {
        return res.status(401).json({status: false, message: err.message})
      } 
      else {
        //Storing payload data -------------------------------------
        req.decodeedData = decoded.data;

        //next middleware | Router handeler ------------------------
        next();
      }
    });

  } catch(err) {
    //Error Respond ---------------------------------------------
    res.status(500).json({status: false, message: err.message});
  }
}