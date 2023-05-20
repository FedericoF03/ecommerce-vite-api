import Express from "express";
import {refreshAcces} from "../../middlewares/refreshAcces.js"
import {DBdisconnect} from "../../middlewares/DB.js"
import { favoriteGet, userGet } from "./functions.js";

const Router = Express.Router()

Router.get("/me", refreshAcces, userGet, DBdisconnect)
Router.get("/favorite", refreshAcces, favoriteGet, DBdisconnect)
export default Router