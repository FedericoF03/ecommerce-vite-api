export const verifyAuth = async (req, res, next) => {
  try {
    if (!req.cookies.access && req.cookies.refresh) {
      const httpConfig = {
        url: "https://api.mercadolibre.com/oauth/token",
        body: {
          method: "POST",
          headers: {
            accept: "application/json",
            "content-type": "application/x-www-form-urlencoded",
          },
          body: `grant_type=refresh_token&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&refresh_token=${req.cookies.refresh}`,
        },
      };
      const getRefresh = await fetch(httpConfig.url, httpConfig.body);
      const refresh = await getRefresh.json();
      const hours = {
        acces: 1000 * 60 * 60 * 6,
        refresh: 1000 * 60 * 60 * 24 * 7,
      };
      res.cookie("access", refresh.access_token, {
        httpOnly: true,
        secure: true,
        maxAge: hours.acces,
      });
      res.cookie("refresh", refresh.refresh_token, {
        httpOnly: true,
        secure: true,
        maxAge: hours.refresh,
      });
    }
    next();
  } catch (error) {
    console.log(error);
  }
};
