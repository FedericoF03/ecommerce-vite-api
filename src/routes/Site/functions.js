export const currency = async (req, res, next) => {
  try {
    const { currency } = req.body;
    const resp = await fetch(
      `https://api.mercadolibre.com/currencies/${currency}`
    );
    const request = await resp.json();
    next();
    res.json(request);
  } catch (error) {
    res.status(404).json(error.message);
  }
};

export const categories = async (req, res, next) => {
  try {
    const { site } = req.body;
    const resp = await fetch(
      `https://api.mercadolibre.com/sites/${site}/categories`
    );
    const request = await resp.json();
    next();
    res.json(request);
  } catch (error) {
    res.status(404).json(error.message);
  }
};

export const categorieData = async (req, res, next) => {
  try {
    const { site } = req.params;
    const resp = await fetch(`https://api.mercadolibre.com/categories/${site}`);
    const request = await resp.json();
    next();
    res.json(request);
  } catch (error) {
    next();
    res.status(404).json(error.message);
  }
};

export const categoryAttributes = async (req, res, next) => {
  try {
    const { site } = req.params;
    const resp = await fetch(
      `https://api.mercadolibre.com/categories/${site}/attributes `
    );
    const request = await resp.json();
    next();
    res.json(request);
  } catch (error) {
    next();
    res.status(404).json(error.message);
  }
};

export const trends = async (req, res, next) => {
  try {
    console.log(`https://api.mercadolibre.com/trends/${req.body.site}`);
    const resp = await fetch(
      `https://api.mercadolibre.com/trends/${req.body.site}`,
      { headers: { Authorization: `Bearer ${req.authentication.acces}` } }
    );
    const request = await resp.json();
    next();
    res.json(request);
  } catch (error) {
    next();
    res.status(404).json(error.message);
  }
};

export const trendsCategory = async (req, res, next) => {
  try {
    const resp = await fetch(
      `https://api.mercadolibre.com/highlights/${req.body.site}/category/${req.params.category}`,
      { headers: { Authorization: `Bearer ${req.authentication.acces}` } }
    );
    const request = await resp.json();
    next();
    res.json(request);
  } catch (error) {
    next();
    res.status(404).json(error.message);
  }
};

export const trendsHighlights = async (req, res, next) => {
  try {
    console.log(req.params)
    const resp = await fetch(
      `https://api.mercadolibre.com/highlights/${req.body.site}/category/${req.params.category}`,
      { headers: { Authorization: `Bearer ${req.authentication.acces}` } }
    );
    const request = await resp.json();
    next();
    res.json(request);
  } catch (error) {
    next();
    res.status(404).json(error.message);
  }
};
