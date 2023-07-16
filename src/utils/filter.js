export const filter = (req, res, next) => {
  
  if (Object.keys(req.query).length === 0) req.query.filter = ""
  else {
    const query = new URLSearchParams(req.query)
    req.query.filter = query
  }
  next()
};
