import Express from "express";
import {verifyAuth} from "../../middlewares/VerifyAuth.js"
import mongooseConnect, {DBdisconnect} from "../../middlewares/DB.js"
import { userCreate, userGet } from "./functions.js";

const Router = Express.Router()

Router.use("/me", verifyAuth, userGet)
Router.use("/create", mongooseConnect, verifyAuth, userCreate, DBdisconnect)

export default Router