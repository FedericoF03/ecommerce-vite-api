import Express from "express";
import AuthRoutes from "./Auth/Auth.js";

const Router = Express.Router();
Router.use("/auth", AuthRoutes);

export default Router;
