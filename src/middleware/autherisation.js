export const Autherisation = async (req, res, next) => {
  try {
    //Collecting userId from Token ----------------------
    const data = req.decodeedData;

    //Data not present ----------------------------------
    if (!data || Object.keys(req.params).length === 0) {
      return res.status(400).json({status: false, message: "Something going wrong"});
    }

    //Collecting UserId from Req Params -----------------
    const userId = req.params.userId;
    
    //Miss match ----------------------------------------
    if (userId !== data) {
      return res.status(400).json({status: false, message: "Access Denied"});
    }

    //next Middleware | Route handeler ------------------
    next();

  } catch(err) {
    //Error Respond -------------------------------------
    res.status(500).json({status: false, message: err.message});
  }
}