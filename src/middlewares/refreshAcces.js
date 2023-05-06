import { HTTPConfig } from "../utils/HTTPconfig.js";
import { cookiesConfig } from "../utils/cookiesConfig.js";

export const refreshAcces = async (req, res, next) => {
  try {
    if (!req.cookies.access && req.cookies.refresh) {
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
    }
    next();
  } catch (error) {
    return res.status(404).json("no auth");
  }
};
