export const HTTPConfig = {
  redirect: "http://localhost:3000/auth/authorization",
  urlAccess: "https://api.mercadolibre.com/oauth/token",
  bodyAccess: {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/x-www-form-urlencoded",
    },
  },
};
