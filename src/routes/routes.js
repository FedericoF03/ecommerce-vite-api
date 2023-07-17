import Express from "express";

import AuthRoutes from "./Auth/Auth.js";
import UserRoutes from "./user/User.js";
import ProductsRoutes from "./Products/products.js";
import SiteRoutes from "./Site/Site.js";

import checkRefresh from "../middlewares/checkrefresh.js";
import checkAcces from "../middlewares/checkAcces.js";

import getCountryForIp from "../utils/getCountryForIp.js";
import refreshAcces from "../middlewares/refreshAcces.js";

const Router = Express.Router();

Router.use("/authentication", AuthRoutes)
  .use(refreshAcces)
  .use(checkRefresh)
  .use(checkAcces)
  .use("/user", UserRoutes)
  .use(getCountryForIp)
  .use("/products", ProductsRoutes)
  .use("/site", SiteRoutes);
export default Router;
