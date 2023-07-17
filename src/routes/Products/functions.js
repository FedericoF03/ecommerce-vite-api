import handlerError from "../../utils/handleError.js";

export const items = async (req, res, next) => {
  try {
    const { filter } = req.query;
    const { site } = req.body;

    const resp = await fetch(
      `https://api.mercadolibre.com/sites/${site}/search?${filter}`
    );
    const request = await resp.json();
    if (request.results.length < 1) handlerError("not results");
    next();
    res.json(request);
  } catch (error) {
    next();
    res.status(404).json(error.message);
  }
};

export const itemQuestions = async (req, res, next) => {
  try {
    if (!req.query.filter) handlerError("not exist id");
    const { filter } = req.query;

    const resp = await fetch(
      `https://api.mercadolibre.com/questions/search?${filter}&limit=3`
    );
    const request = await resp.json();
    if (request.questions.length < 1) handlerError("not results");
    next();
    res.json(request);
  } catch (error) {
    next();
    res.status(404).json(error.message);
  }
};

export const itemDescription = async (req, res, next) => {
  try {
    const itemId = req.body.id;
    if (!itemId) handlerError("not exist Id");

    const resp = await fetch(
      `https://api.mercadolibre.com/items/${itemId}/description`
    );
    const request = await resp.json();
    if (!request.plain_text) handlerError("not results");
    next();
    res.json(request);
  } catch (error) {
    next();
    res.status(404).json(error.message);
  }
};

export const itemOpinions = async (req, res, next) => {
  try {
    const { filter } = req.query;
    const itemId = req.body.id;
    if (!itemId) handlerError("not exist Id");

    const resp = await fetch(
      `https://api.mercadolibre.com/reviews/item/${itemId}?${filter}`,
      { headers: { Authorization: `Bearer ${req.authentication.acces}` } }
    );
    const request = await resp.json();
    if (request.status === 401) handlerError(request.message);
    next();
    res.json(request);
  } catch (error) {
    next();
    res.status(404).json(error.message);
  }
};

export const itemsVisits = async (req, res, next) => {
  try {
    const { filter } = req.query;

    const resp = await fetch(
      `https://api.mercadolibre.com/visits/items?${filter}`,
      { headers: { Authorization: `Bearer ${req.authentication.acces}` } }
    );
    const respPeriod = await fetch(
      `https://api.mercadolibre.com/items/visits/time_window?${filter}`,
      { headers: { Authorization: `Bearer ${req.authentication.acces}` } }
    );
    const request = await resp.json();
    const requestPeriod = await respPeriod.json();
    if (request.status === 401) handlerError(request.message);
    next();
    res.status(200).json({ request, requestPeriod });
  } catch (error) {
    console.log(error);
    next();
    res.status(404).json(error.message);
  }
};
