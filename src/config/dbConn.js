import mongoose from "mongoose";

//Mongodb Connection
mongoose.connect(process.env.MONGODB_URL)
  .then(()=> console.log("DB Connected Successfully"))
  .catch((err)=> console.log(err))