import Express from "express";
import {refreshAcces} from "../../middlewares/refreshAcces.js"
import {DBdisconnect} from "../../middlewares/DB.js"
import { userGet } from "./functions.js";

const Router = Express.Router()

Router.use("/me", refreshAcces, userGet, DBdisconnect)
export default Router