import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

import { DBdisconnect } from "./DB.js";
import UserController from "../controllers/UserController.js";
import { HTTPConfig } from "../utils/HTTPconfig.js";
import { cookiesConfig, hours } from "../utils/cookiesConfig.js";
import TokenController from "../controllers/TokenController.js";

export const refreshAcces = async (req, res, next) => {
  try {
    //Verifica la existencia del refresh y en caso contrario devolver
    if (!req.cookies.refresh) throw new Error("The refresh token not exist");
    const refresh = jwt.verify(req.cookies.refresh, process.env.SECRET_KEY);

    const Token = new TokenController();
    const dateNow = new Date();
    const resToken = await Token.controllerFindToken({
      $and: [
        { "refresh_tokens.tokens.code": refresh },
        { "refresh_tokens.tokens.date": { $lt: dateNow } },
      ],
    });
    if (resToken && resToken.acces_token.date < dateNow) {
      if (refresh.includes("TG")) {
        const url = [
          `grant_type=refresh_token`,
          `client_id=${process.env.CLIENT_ID}`,
          `client_secret=${process.env.CLIENT_SECRET}`,
          `refresh_token=${refresh}`,
        ].join("&");
        HTTPConfig.bodies.objPost.body = url;
        const getRefresh = await fetch(
          HTTPConfig.urls.urlAccessToken,
          HTTPConfig.bodies.objPost
        );
        const resrefresh = await getRefresh.json();
        await Token.controllerUpdateToken(
          {
            id_MELI: resToken.id_MELI,
          },
          {
            acces_token: {
              code: resrefresh.access_token,
              date: new Date(Date.now() + hours.hours6),
            },
            $push: {
              "refresh_tokens.tokens": {
                code: resrefresh.refresh_token,
                date: new Date(Date.now() + hours.week),
                ip: req.ip,
              },
            },
          }
        );
        const refreshJWT = jwt.sign(
          resrefresh.refresh_token,
          process.env.SECRET_KEY
        );
        res.cookie("refresh", refreshJWT, cookiesConfig);
      } else {
        const user = new UserController();
        await user.controllerUpdateUser(
          {
            acces_token: {
              token: uuidv4().split("-").join(""),
              date: new Date(Date.now() + hours.hours6),
            },
          },
          {
            $and: [
              { "acces_token.date": { $lt: new Date() } },
              { "refresh_token.token": req.cookies.refresh },
            ],
          }
        );
      }
    }
    next();
  } catch (error) {
    console.log(error);
    DBdisconnect();
    return res.status(404).json("no auth");
  }
};
