import mongoose from "mongoose";

async function DBConnect(req, res, next) {
  try {
    console.log('abrio DB')
    await mongoose.connect(process.env.DB_URL);
  } catch (error) {
    console.log(error);
    return next();
  }
  return next();
  
}

export default DBConnect;

export async function DBdisconnect(req, res) {
  try {
    console.log('cerro DB')
    await mongoose.disconnect(process.env.DB_URL);
  } catch (error) {
    console.log(error);
  }
  res.status(200).json(true)
  
}
