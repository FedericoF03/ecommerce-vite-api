import Express from "express";
import { login, register } from "./functions.js";

const router = Express.Router();
router.get("/authorization", register, login )

export default router
