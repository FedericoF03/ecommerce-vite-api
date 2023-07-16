import handlerError from "./handleError.js";

const getCountryForIp = async (req, res, next) => {
  const defaultValue = "MLA";
  try {
    if (
      !req.url.includes("/authentication") &&
      !req.url.includes("/user") &&
      req.body.site
    )
      return next();
    const getCountryIP = await fetch(
      `https://api.iplocation.net/?ip=${req.ip}`
    );
    const resCountryIP = await getCountryIP.json();
    // if (!resCountryIP || resCountryIP.ip === "::1")
    //   return handlerError("Not country finded");
    const { country_code2 } = resCountryIP;

    const getCurrency = await fetch(
      `https://api.mercadolibre.com/classified_locations/countries/AR`
    );
    const resCurrency = await getCurrency.json();
    if (!resCurrency) return handlerError("Not country finded");
    const { currency_id } = resCurrency;

    const getDomain = await fetch(`https://api.mercadolibre.com/sites`);
    const resDomain = await getDomain.json();
    console.log(resDomain)
    if (!resDomain) return handlerError("Not country finded");
    const { id } = resDomain.find(
      (el) => el.default_currency_id === currency_id
    );
    req.body.site = id;
    req.body.currency = currency_id
  } catch (error) {
    req.body.site = defaultValue;
  }
  next();
};

export default getCountryForIp;
