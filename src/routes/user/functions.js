import UserController from "../../controllers/UserController.js";

export const userGet = async (req, res, next) => {
  const HTTPconfig = {
    url: "https://api.mercadolibre.com/users/me",
    token: `Bearer ${req.cookies.access}s`,
    accesConfigInit: "APP",
  };
  if (req.cookies.access && req.cookies.access.includes(HTTPconfig.accesConfigInit)) {
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
    const user = new UserController();
    const resUser = await user.controllerFindUser({
      "refresh_token.token": req.cookies.refresh,
    });
    // console.log(resUser)
    next();
    if (resUser) return res.json(resUser);
    if (!resUser) return res.json("no auth");
  }
};
