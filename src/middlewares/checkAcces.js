import TokenController from "../controllers/TokenController.js";
import jwt from "jsonwebtoken";
import handlerError from "../utils/handleError.js";
import UserController from "../controllers/UserController.js";

const checkAcces = async (req, res, next) => {
  try {
    if (req.url.includes("/authentication")) return next();
    const token = new UserController();
    const resToken = await token.controllerFindUser({
      $and: [
        { "acces_token.tokens.date": { $gt: new Date() } },
        { "acces_token.tokens.code": req.authentication.acces },
      ],
    });
    if (!resToken) handlerError("no se logro authentication.");
    req.authentication = {
      status: true,
      id: resToken.id,
      id_MELI: resToken.id_MELI,
      ...req.authentication,
    };
    next();
  } catch (error) {
    return res.status(402).json(error.message);
  }
};

export default checkAcces;
