import TokenController from "../controllers/TokenController.js";
import jwt from "jsonwebtoken";
import handlerError from "../utils/handleError.js";

const checkRefresh = async (req, res, next) => {
  try {
    if (req.url.includes("/authentication")) return next();
    if (!req.cookies.refresh) handlerError("The refresh token does not exist.");
    const refresh = jwt.verify(req.cookies.refresh, process.env.SECRET_KEY);
    const token = new TokenController();
    const resToken = await token.controllerFindToken({
      $and: [
        { "refresh_token.date": { $gt: new Date() } },
        { "refresh_token.code": refresh },
      ],
    });
    if (!resToken) handlerError("no se logro authentication.");
    const { acces_token } = resToken;
    req.authentication = { acces: acces_token.code };
    next();
  } catch (error) {
    return res.status(402).json(error.message);
  }
};

export default checkRefresh;
