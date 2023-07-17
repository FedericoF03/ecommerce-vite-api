import jwt from "jsonwebtoken";
import FavoriteController from "../../controllers/FavoriteController.js";
import UserController from "../../controllers/UserController.js";
import TokenController from "../../controllers/TokenController.js";
import CartController from "../../controllers/CartController.js";
import BoughtController from "../../controllers/BoughtController.js";
import handlerError from "../../utils/handleError.js";
import { filter } from "../../utils/filter.js";

export const userGet = async (req, res, next) => {
  try {
    if (!req.authentication.status) handlerError("Not auth");
    if (req.authentication.id_MELI) {
      const HTTPconfig = {
        url: "https://api.mercadolibre.com/users/me",
        token: `Bearer ${req.authentication.acces}`,
      };
      const request = {
        headers: {
          Authorization: HTTPconfig.token,
        },
      };
      const getUser = await fetch(HTTPconfig.url, request);
      const user = await getUser.json();
      if (user.status == 400) handlerError("no auth api");
      return res.json(user);
    } else if (req.authentication.id) {
      const filter = {
        id: req.authentication.id,
      };
      const user = new UserController();
      const resUser = await user.controllerFindUserData(filter);
      if (!resUser) handlerError("No se pudo autenticar");

      return res.json(resUser);
    } else handlerError("Key not valid");
    next();
  } catch (error) {
    return res.status(402).json(error);
  }
};

//Favorite methods

export const favoriteGet = async (req, res, next) => {
  try {
    if (!req.authentication) handlerError("Not auth");
    if (req.authentication.id_MELI) {
      const HTTPconfig = {
        url: "https://api.mercadolibre.com/users/me/bookmarks",
        token: `Bearer ${req.authentication.acces}`,
      };
      const request = {
        headers: {
          Authorization: HTTPconfig.token,
        },
      };
      const getUser = await fetch(HTTPconfig.url, request);
      const user = await getUser.json();

      if (user.status == 400) handlerError("no auth api");
      next();
      return res.json(user);
    } else if (req.authentication.id) {
      const filter = {
        id: req.authentication.id,
      };
      const user = new FavoriteController();
      const resUser = await user.controllerFindFavorite(filter);
      if (!resUser || resUser.items.length < 1)
        handlerError("No hay nada en favoritos");
      next();
      return res.json(resUser);
    }
  } catch (error) {
    return res.status(402).json(error.message);
  }
};

export const favoritePost = async (req, res, next) => {
  try {
    if (!req.authentication.status) handlerError("no tiene permisos");
    if (!req.body.item_id) handlerError("no hay id");

    if (req.authentication.id_MELI) {
      const query = req.body.item_id;

      const HTTPconfig = {
        url: "https://api.mercadolibre.com/users/me/bookmarks",
        token: `Bearer ${req.authentication.acces}`,
      };

      const request = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: HTTPconfig.token,
        },
        body: JSON.stringify({ item_id: query }),
      };
      const getUser = await fetch(HTTPconfig.url, request);
      const user = await getUser.json();
      console.log(user);
      if (user.status === 400) handlerError("no auth api");
      next();
      return res.json(user);
    } else if (req.authentication.id) {
      const request = {
        filter: {
          id_DB: req.authentication.id,
        },
        obj: {
          $push: {
            items: {
              item_id: req.body.item_id,
            },
          },
        },
        options: { upsert: true },
      };
      const user = new FavoriteController();
      await user.controllerUpdateFavorite(
        request.filter,
        request.obj,
        request.options
      );
      return res.json("exito");
    }
  } catch (error) {
    return res.status(402).json(error.message);
  }
};

export const favoriteDelete = async (req, res, next) => {
  try {
    if (!req.authentication.status) handlerError("no tiene permisos");
    if (!req.body.item_id) handlerError("no hay id");
    if (req.authentication.id_MELI) {
      const query = req.body.item_id;

      const HTTPconfig = {
        url: `https://api.mercadolibre.com/users/me/bookmarks/${query}`,
        token: `Bearer ${req.authentication.acces}`,
      };
      const request = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: HTTPconfig.token,
        },
      };
      const getUser = await fetch(HTTPconfig.url, request);
      if (getUser.status === 400) handlerError("No se hizo la peticion");
      next();
      return res.json(true);
    } else if (req.authentication.id) {
      const request = {
        filter: {
          id_DB: req.authentication.id,
        },
        obj: {
          $pull: {
            items: {
              item_id: req.body.item_id,
            },
          },
        },
        options: { upsert: true },
      };
      const user = new FavoriteController();
      await user.controllerUpdateFavorite(
        request.filter,
        request.obj,
        request.options
      );
      return res.json("exito");
    }
  } catch (error) {
    console.log(error);
    return res.status(402).json(error.message);
  }
};

//Cart methods

export const cartGet = async (req, res, next) => {
  try {
    if (!req.authentication) handlerError("Not auth");

    const request = {
      filter: {
        $or: [
          { id_MELI: req.authentication.id_DB },
          { id_DB: req.authentication.id },
        ],
      },
    };

    const CART = new CartController();
    let CARTGET = { items: [] };
    const CARTRESPONSE = await CART.controllerFindCart(request.filter);
    const obj = {
      id_DB: req.authentication.id,
      id_MELI: req.authentication.id_MELI,
    };
    if (!CARTRESPONSE) CART.controllerCreateCart(obj);
    else CARTGET = CARTRESPONSE;
    next();
    return res.status(200).json(CARTGET);
  } catch (error) {
    return res.status(402).json(error.message);
  }
};

export const cartPost = async (req, res, next) => {
  try {
    if (!req.authentication) handlerError("Not auth");
    const body = {
      ...req.body,
      bookmarked_date: Date(Date.now().toLocaleString()),
    };
    const request = {
      filter: {
        $or: [
          { id_MELI: req.authentication.id_MELI },
          { id_DB: req.authentication.id },
        ],
      },
      obj: {
        id_MELI: req.authentication.id_MELI ? req.authentication.id_MELI : null,
        $push: {
          items: {
            item_id: body.item_id,
            quantity: body.quantity,
            bookmarked_date: new Date(Date.now()),
          },
        },
      },
      options: { upsert: true },
    };

    const CART = new CartController();
    CART.controllerUpdateCart(request.filter, request.obj, request.options);
    next();
    return res.status(200).json(body);
  } catch (error) {
    console.log(error);
    return res.status(402).json(error.message);
  }
};

export const cartDelete = async (req, res, next) => {
  try {
    if (!req.authentication) handlerError("Not auth");
    const body = req.body;

    const request = {
      filter: {
        $or: [
          { id_MELI: req.authentication.id_MELI },
          { id_DB: req.authentication.id },
        ],
      },
      obj: {
        $pull: {
          items: {
            item_id: body.item_id,
          },
        },
      },
    };

    const CART = new CartController();
    CART.controllerUpdateCart(request.filter, request.obj);
    next();
    return res.status(200).json(body);
  } catch (error) {
    console.log(error);
    return res.status(402).json(error.message);
  }
};

//Bought methods

export const boughtGet = async (req, res, next) => {
  try {
    if (!req.authentication) handlerError("Not auth");

    const request = {
      filter: {
        $or: [
          { id_MELI: req.authentication.id_MELI },
          { id_DB: req.authentication.id },
        ],
      },
    };

    const BOUGHT = new BoughtController();
    let BOUGHTGET = { items: [] };
    const BOUGHTRESPONSE = await BOUGHT.controllerFindBought(request.filter);
    const obj = {
      id_DB: req.authentication.id,
      id_MELI: req.authentication.id_MELI ? req.authentication.id_MELI : null,
    };

    if (!BOUGHTRESPONSE) BOUGHT.controllerCreateBought(obj);
    else BOUGHTGET = CARTRESPONSE;
    next();
    return res.status(200).json(BOUGHTGET);
  } catch (error) {
    return res.status(402).json(error.message);
  }
};

export const boughtPost = async (req, res, next) => {
  try {
    if (!req.authentication) handlerError("Not auth");

    const request = {
      filter: {
        $or: [
          { id_MELI: req.authentication.id_MELI },
          { id_DB: req.authentication.id },
        ],
      },
      obj: {
        id_MELI: req.authentication.id_MELI ? req.authentication.id_MELI : null,
        items: [],
      },
      options: { upsert: true },
    };

    const CART = new CartController();
    const BOUGHT = new BoughtController();
    const CARTDATA = await CART.controllerUpdateCart(
      request.filter,
      request.obj,
      request.options
    );
    request.order = {
      $push: {
        orders: {
          items: CARTDATA.items,
          quantityTotal: CARTDATA.items.length,
          bookmarked_date: Date(Date.now().toLocaleString()),
          priceTotal: 100,
        },
      },
    };
    BOUGHT.controllerUpdateBought(
      request.filter,
      request.order,
      request.options
    );
    next();
    return res.status(200).json(true);
  } catch (error) {
    console.log(error);
    return res.status(402).json(error.message);
  }
};

export const sellerProfile = async (req, res, next) => {
  try {
    const itemId = req.body.id;
    if (!itemId) handlerError("not exist Id");

    const HTTPconfig = {
      url: `https://api.mercadolibre.com/users/${itemId}`,
      token: `Bearer ${req.authentication.acces}`,
    };
    const request = {
      headers: {
        Authorization: HTTPconfig.token,
      },
    };
    const getUser = await fetch(HTTPconfig.url, request);
    const user = await getUser.json();

    next();
    return res.json(user);
  } catch (error) {
    return res.status(402).json(error.message);
  }
};
