import Express from "express";
import { generateRedirect, loginMELI, registerApi, registerApiConfirm, loginApi } from "./functions.js";
import DBConnect, { DBdisconnect } from "../../middlewares/DB.js";

const router = Express.Router();
router.get("/meli", generateRedirect)
router.get("/meli/confirm", DBConnect, loginMELI, DBdisconnect)
router.post("/register", DBConnect, registerApi, DBdisconnect)
router.post("/register/confirm", DBConnect, registerApiConfirm, DBdisconnect)
router.post("/api", DBConnect, loginApi, DBdisconnect)

export default router
