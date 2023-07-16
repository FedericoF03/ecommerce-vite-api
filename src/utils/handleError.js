const handlerError = (msg) => {
  const err = new Error(msg);

  if (err.message === "The refresh token does not exist.") {
    err.msg = err.message;
    err.code = 400;
    err.redirect = "http://localhost:3000/authentication/login";
  } else {
    err.code = 404;
  }

  throw err;
};

export default handlerError;
