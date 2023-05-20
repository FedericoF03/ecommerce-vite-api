import jwt from "jsonwebtoken";
import FavoriteController from "../../controllers/FavoriteController.js";
import UserController from "../../controllers/UserController.js";
import TokenController from "../../controllers/TokenController.js";

export const userGet = async (req, res, next) => {
  try {
    if (!req.cookies.refresh) throw new Error("no hay refresh guardado");
    const refresh = jwt.verify(req.cookies.refresh, process.env.SECRET_KEY);
    console.log(refresh);
    const token = new TokenController();
    const resToken = await token.controllerFindToken({
      $and: [
        { "acces_token.date": { $gt: new Date() } },
        { "refresh_tokens.tokens.code": refresh },
      ],
    });
    if (!resToken) throw new Error("no se logro authentication");
    if (resToken.acces_token.code.includes("APP")) {
      const HTTPconfig = {
        url: "https://api.mercadolibre.com/users/me",
        token: `Bearer ${resToken.acces_token.code}`,
      };
      const request = {
        headers: {
          Authorization: HTTPconfig.token,
        },
      };
      const getUser = await fetch(HTTPconfig.url, request);
      const user = await getUser.json();
      console.log(user);
      if (user.status == 400) throw new Error("no auth api");
      next();
      return res.json(user);
    } else if (!resToken.acces_token.code.includes("APP")) {
      const filter = {
        id: resToken.id_DB,
      };
      const user = new UserController();
      const resUser = await user.controllerFindUserData(filter);
      if (!resUser) throw new Error("No se pudo autenticar");
      next();
      return res.json(resUser);
    }
  } catch (error) {
    return res.status(402).json(error);
  }
};

export const favoriteGet = async (req, res, next) => {
  const HTTPconfig = {
    url: "https://api.mercadolibre.com/users/me",
    token: `Bearer ${req.cookies.access}`,
    accesConfigInit: "APP",
  };
  if (
    req.cookies.access &&
    req.cookies.access.includes(HTTPconfig.accesConfigInit)
  ) {
    const getUser = await fetch(HTTPconfig.url, {
      headers: {
        Authorization: HTTPconfig.token,
      },
    });
    const user = await getUser.json();
    next();
    if (user.status == 400) return res.json("no auth api");
    res.json(user);
  } else {
    const user = new FavoriteController();
    const resUser = await user.controllerFindFavorite();
    // console.log(resUser)
    next();
    if (resUser) return res.json(resUser);
    if (!resUser) return res.json("no auth");
  }
};
