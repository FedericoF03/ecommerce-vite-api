import UserController from "../../controllers/UserController.js";

export const userGet = async (req, res, next) => {
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
  if (user.status !== 400) {
    next();
    res.json(user);
  } else {
    const user = new UserController();
    const resUser = await user.controllerFindUserML({
      acces_token: req.cookies.acces
    });
    next();
    resUser && res.json(resUser);
    !resUser && res.json("no auth")
  }
};
