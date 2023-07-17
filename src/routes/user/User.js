import Express from "express";
import {
  favoriteGet,
  favoritePost,
  userGet,
  cartGet,
  cartPost,
  boughtGet,
  boughtPost,
  cartDelete,
  favoriteDelete,
  sellerProfile,
} from "./functions.js";

const Router = Express.Router();

Router.get("/favorite", favoriteGet)
  .post("/favorite", favoritePost)
  .delete("/favorite", favoriteDelete)
  .get("/cart", cartGet)
  .post("/cart", cartPost)
  .delete("/cart", cartDelete)
  .get("/bought", boughtGet)
  .post("/bought", boughtPost)
  .get("/me", userGet)
  .get("/seller/profile", sellerProfile);
export default Router;
