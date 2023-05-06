import mongoose from "mongoose";

async function DBConnect(req, res, next) {
  try {
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
    await mongoose.disconnect(process.env.DB_URL);
  } catch (error) {
    console.log(error);
  }
}
