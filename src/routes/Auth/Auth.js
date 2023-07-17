import Express from "express";
import {
  generateRedirect,
  loginMELI,
  registerApi,
  registerApiConfirm,
  loginApi,
  disconnectUser,
} from "./functions.js";

const router = Express.Router()
  .get("/meli", generateRedirect)
  .get("/meli/confirm", loginMELI)
  .post("/register", registerApi)
  .post("/register/confirm", registerApiConfirm)
  .post("/api", loginApi)
  .post("/disconnect", disconnectUser);

export default router;
