export const HTTPConfig = {
  redirect: "http://localhost:3000/auth/authorization",
  urls: {
    urlAccessToken: "https://api.mercadolibre.com/oauth/token",
  },
  bodies: {
    objPost: {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/x-www-form-urlencoded",
      },
    },
  }
  
  
};
