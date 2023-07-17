import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

import { DBdisconnect } from "./DB.js";
import UserController from "../controllers/UserController.js";
import { HTTPConfig } from "../utils/HTTPconfig.js";
import { cookiesConfig, hours } from "../utils/cookiesConfig.js";
import TokenController from "../controllers/TokenController.js";
import handlerError from "../utils/handleError.js";

const refreshAcces = async (req, res, next) => {
  try {
    //Verifica la existencia del refresh y en caso contrario devolver
    if (req.url.includes("/authentication")) return next();
    if (!req.cookies.refresh) handlerError("The refresh token does not exist.");
    console.log(req.cookies)
    //Descrifa refresh token
    const token = jwt.verify(req.cookies.refresh, process.env.SECRET_KEY);
    const Token = new TokenController();
    const dateNow = new Date();

    const request = {
      $and: [
        { "refresh_token.code": token },
        { "refresh_token.date": { $lt: dateNow } },
      ],
    };
    const resToken = await Token.controllerFindToken(request);
    if (!resToken) return next()

    let objrefresh = {
      acces: uuidv4().split("-").join(""),
      refresh: uuidv4().split("-").join(""),
    };

    if (token.includes("TG")) {
      console.log(token)
      const url = [
        `grant_type=refresh_token`,
        `client_id=${process.env.CLIENT_ID}`,
        `client_secret=${process.env.CLIENT_SECRET}`,
        `refresh_token=${token}`,
      ].join("&");

      HTTPConfig.bodies.objPost.body = url;

      const getRefresh = await fetch(
        HTTPConfig.urls.urlAccessToken,
        HTTPConfig.bodies.objPost
      );
      const response = await getRefresh.json();
      console.log(response)
      objrefresh = { acces: response.access_token, refresh: response.refresh_token };
    }

    request.filterFindUser = {
      "refresh_token.code": token,
    };

    request.tokenUpdate = {
      acces_token: {
        code: objrefresh.acces,
      },
      refresh_token: {
        code: objrefresh.refresh,
        date: new Date(Date.now() + hours.week),
      },
    };

    await Token.controllerUpdateToken(
      request.filterFindUser,
      request.tokenUpdate
    );

    const updateUser = {
      $push: {
        "acces_token.tokens": {
          code: objrefresh.acces,
          date: new Date(Date.now() + hours.hours6),
          ip: req.ip,
        },
      },
    };

    const User = new UserController();
    const userRes = await User.controllerUpdateUser(
      { "acces_token.tokens.code": resToken.acces_token.code },
      updateUser
    );
    if (!userRes) handlerError("No se encontro registro");
    const refreshJWT = jwt.sign(objrefresh.refresh, process.env.SECRET_KEY);
    refreshJWT
    res.cookie("refresh", refreshJWT, cookiesConfig);
    return next()
  } catch (error) {
    return res.status(404).json(error.message);
  }
};

export default refreshAcces;
