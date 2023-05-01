import Express from "express";

const Router = Express.Router();

Router.get("/", (req, res) => {
  console.log("sas")
  res.send("Ruta")
});


export default Router