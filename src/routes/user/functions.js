import UserController from "../../controllers/UserController.js";
import { v4 as uuidv4 } from "uuid";

export const userGet = async (req, res) => {
  const HTTPconfig = {
    url: "https://api.mercadolibre.com/users/me",
    token: `Bearer ${req.cookies.access}`,
  };
  const getUser = await fetch(HTTPconfig.url, {
    headers: {
      Authorization: HTTPconfig.token,
    },
  });
  const user = await getUser.json();
  console.log(user);
  res.status(200).json(true);
};

export const userCreate = async (req, res, next) => {
  console.log("paso por ruta");
  const userController = await new UserController();
  await userController.controllerCreateUser({});
  next();
};
