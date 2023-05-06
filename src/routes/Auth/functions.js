import UserController from "../../controllers/UserController.js";
import {
  base64URLEncode,
  sha256,
  generateState,
} from "../../middlewares/URLEncode.js";
import { HTTPConfig } from "../../utils/HTTPconfig.js";
import { cookiesConfig, hours } from "../../utils/cookiesConfig.js";
import { v4 as uuidv4 } from "uuid";

export const registerML = (req, res, next) => {
  try {
    //Checkea si existe el query code, si es asi se va a la siguiente function Login
    if (req.query?.code) return next();

    //No existe crea el verifier para generar el challemge
    // y almacena en cookie segura y interceptable solo en peticiones HTTP
    const verifier = base64URLEncode();
    res.cookie("verifier", verifier, cookiesConfig);
    const challenge = base64URLEncode(sha256(verifier));

    //creo el state para generar seguridad extra
    const state = generateState();
    const url = `https://auth.mercadolibre.com.ar/authorization?response_type=code&client_id=${process.env.CLIENT_ID}&redirect_uri=${HTTPConfig.redirect}&code_challenge=${challenge}&code_challenge_method=S256&state=${state}`;
    res.status(200).json(url);
  } catch (error) {
    console.log(error);
    res.status(404).json("Error");
  }
};

export const registerApi = async (req, res, next) => {
  try {
    const user = new UserController();
    await user.controllerCreateUser();
  } catch (error) {
    console.log(error);
    res.status(404).json("Error");
  }
  res.json(true)
  next();
};

export const login = async (req, res) => {
  try {
    //checkeo si existe verifier, si no es el caso
    // significa que hubo un problema y no fue encontrado
    if (!req.cookies?.verifier) throw new Error("Verifier not found");
    //se hace la peticion para obtener el acces token o en su defecto rechazar
    HTTPConfig.bodyAccess.body = `grant_type=authorization_code&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&code=${req.query.code}&redirect_uri=${HTTPConfig.redirect}&code_verifier=${req.cookies.verifier}`;
    const acces = await fetch(HTTPConfig.urlAccess, HTTPConfig.bodyAccess);
    const resAcces = await acces.json();

    if (resAcces.status === 400) throw new Error("Error en la Autenticacion");

    //Todo procedio bien entonces se borra la cookie verifier,
    // y se crean las de uso una con duraccion de 6 horas

    res.clearCookie("verifier");

    cookiesConfig.maxAge = hours.acces;
    res.cookie("access", resAcces.access_token, cookiesConfig);

    cookiesConfig.maxAge = hours.refresh;
    res.cookie("refresh", resAcces.refresh_token, cookiesConfig);

    //Enviar un status 200 para indicar que todo procedio bien
    // y desarrollar logica de redireccion con el path en un json
    res.status(200).json("/");
  } catch (error) {
    res.clearCookie("verifier");
    res.status(404).json(error.message);
  }
};
