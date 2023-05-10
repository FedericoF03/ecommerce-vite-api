import UserController from "../controllers/UserController.js";
import { HTTPConfig } from "../utils/HTTPconfig.js";
import { cookiesConfig } from "../utils/cookiesConfig.js";
import { v4 as uuidv4 } from "uuid";

export const refreshAcces = async (req, res, next) => {
  try {
    if (
      !req.cookies.access &&
      req.cookies.refresh &&
      req.cookies.refresh.includes("TG")
    ) {
      HTTPConfig.bodyAccess.body = `grant_type=refresh_token&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&refresh_token=${req.cookies.refresh}`;
      const getRefresh = await fetch(HTTPConfig.urlAccess, HTTPConfig.body);
      const refresh = await getRefresh.json();
      const hours = {
        acces: 1000 * 60 * 60 * 6,
        refresh: 1000 * 60 * 60 * 24 * 7,
      };
      cookiesConfig.maxAge = hours.acces;
      res.cookie("access", refresh.access_token, cookiesConfig);
      cookiesConfig.maxAge = hours.refresh;
      res.cookie("refresh", refresh.refresh_token, cookiesConfig);
    } else if (req.cookies.refresh && !req.cookies.refresh.includes("TG")) {
      const user = new UserController();
      const test = await user.controllerUpdateUser(
        {
          acces_token: {
            token: uuidv4().split("-").join(""),
            date: new Date(Date.now() + 21600000),
          },
        },
        {
          $and: [
            { "acces_token.date": { $lt: new Date() } },
            { "refresh_token.token": req.cookies.refresh },
          ],
        }
      );
      console.log(test);
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(404).json("no auth");
  }
};
