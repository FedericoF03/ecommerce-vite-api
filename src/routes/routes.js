import Express from "express";
import AuthRoutes from "./Auth/Auth.js";
import UserRoutes from "./user/User.js";
import mongooseConnect from "../middlewares/DB.js"

const Router = Express.Router();

Router.use("/authentication", AuthRoutes);
Router.use("/user", mongooseConnect, UserRoutes);

export default Router;
