import Express from "express";
import AuthRoutes from "./Auth/Auth.js";
import UserRoutes from "./user/user.js";

const Router = Express.Router();

Router.use("/auth", AuthRoutes);
Router.use("/user", UserRoutes);

export default Router;
