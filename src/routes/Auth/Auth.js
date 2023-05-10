import Express from "express";
import { login, registerApi, registerML, registerApiConfirm, loginApi } from "./functions.js";
import DBConnect, { DBdisconnect } from "../../middlewares/DB.js";

const router = Express.Router();
router.get("/ml", registerML, login )
router.post("/api", DBConnect, registerApi, DBdisconnect)
router.post("/api/confirm", DBConnect, registerApiConfirm, DBdisconnect)
router.post("/login/api", DBConnect, loginApi, DBdisconnect)

export default router
