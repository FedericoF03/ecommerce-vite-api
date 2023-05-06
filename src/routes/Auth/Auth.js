import Express from "express";
import { login, registerApi, registerML } from "./functions.js";
import DBConnect, { DBdisconnect } from "../../middlewares/DB.js";

const router = Express.Router();
router.get("/ml", registerML, login )
router.get("/api", DBConnect, registerApi, DBdisconnect)

export default router
