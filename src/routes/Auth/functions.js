import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

import TokenController from "../../controllers/TokenController.js";
import UserController from "../../controllers/UserController.js";

import sendEmail from "../../middlewares/Email.js";
import {
  base64URLEncode,
  sha256,
  generateState,
} from "../../middlewares/URLEncode.js";

import { HTTPConfig } from "../../utils/HTTPconfig.js";
import { cookiesConfig, hours } from "../../utils/cookiesConfig.js";

export const generateRedirect = (req, res, next) => {
  try {
    //Checkea si existe el query code, si es asi se va a la siguiente function loginMELI
    if (req.query?.code) return next();

    //No existe crea el verifier para generar el challemge
    // y almacena en cookie segura y interceptable solo en peticiones HTTP
    // Se firma el verifier para que solo se descrifre con la clave
    const verifier = base64URLEncode();
    const token = jwt.sign(verifier, process.env.SECRET_KEY);
    const challenge = base64URLEncode(sha256(verifier));

    //creo el state para generar seguridad extra
    const state = generateState();

    //Se guarda en un array para mejor entendimiento y
    // se une despues para formar la url y enviarla
    const url = [
      `https://auth.mercadolibre.com.ar/authorization?response_type=code`,
      `client_id=${process.env.CLIENT_ID}`,
      `redirect_uri=${HTTPConfig.redirect}`,
      `code_challenge=${challenge}`,
      `code_challenge_method=S256`,
      `state=${state}`,
    ].join("&");
    res.cookie("verifier", token, cookiesConfig);
    res.status(200).json(url);
  } catch (error) {
    res.status(404).json(error.message);
  }
};

export const loginMELI = async (req, res, next) => {
  try {
    //checkeo si existe verifier, si no es el caso
    // significa que hubo un problema y no fue encontrado
    // Entonces lanzo error

    if (!req.cookies?.verifier) {
      const error = new Error("Verifier not found");
      error.code = 404;
      throw error;
    }
    //Si existe lo verifica con su llave privada debido a que esta cifrado
    const verifier = jwt.verify(req.cookies.verifier, process.env.SECRET_KEY);

    // Se hace la peticion usando los datos dentro de las opciones y se pasa a obj
    const { code } = req.query;
    const url = [
      `grant_type=authorization_code`,
      `client_id=${process.env.CLIENT_ID}`,
      `client_secret=${process.env.CLIENT_SECRET}`,
      `code=${code}`,
      `redirect_uri=${HTTPConfig.redirect}`,
      `code_verifier=${verifier}`,
    ].join("&");
    HTTPConfig.bodies.objPost.body = url;
    const acces = await fetch(
      HTTPConfig.urls.urlAccessToken,
      HTTPConfig.bodies.objPost
    );
    const resAcces = await acces.json();

    //Se verifica el estado de llegada y si no es correcto se lanza error
    if (resAcces.status === 400) throw new Error("Error en la Autenticacion");

    //Si es correcto se llama al obj y
    // se guardan los datos en caso de no existir pero si existe se actualizan
    const objDB = {
      filter: {
        id_MELI: resAcces.user_id,
      },
      obj: {
        acces_token: {
          code: resAcces.access_token,
          date: new Date(Date.now() + hours.hours6),
        },
        $push: {
          "refresh_tokens.tokens": {
            code: resAcces.refresh_token,
            date: new Date(Date.now() + hours.week),
            ip: req.ip,
          },
        },
      },
      options: { upsert: true },
    };
    const tokenDB = new TokenController();
    await tokenDB.controllerUpdateToken(objDB.filter, objDB.obj, objDB.options);
    //si no hubo problemas finalmente borramos el verifier y enviamos el refresh cifrado
    res.clearCookie("verifier");
    const refresh = jwt.sign(resAcces.refresh_token, process.env.SECRET_KEY);
    res.cookie("refresh", refresh, cookiesConfig);
    next();
    res.status(200).json("/");
  } catch (error) {
    //si el codigo es que no se encontro el verifier entonces se evita el paso de limpiarlo,
    //caso contrario se envia el error
    next();
    if (error !== 404) res.clearCookie("verifier");
    res.status(404).json(error.message);
  }
};

export const registerApi = async (req, res, next) => {
  try {
    
    //Genero el codigo y armo el objeto de la peticion con su filtro, objeto y opcion
    const generateCode = uuidv4().split("-")[0];
    const request = {
      filterCreateOrUpdateUser: {
        $and: [{ email: req.body.email }, { "account.status": false }],
      },
      filterFindUser: {
        $and: [{ email: req.body.email }, { "account.status": true }],
      },
      obj: {
        ...req.body,
        "account.code": generateCode,
      },
      options: {
        upsert: true,
      },
    };

    //Invoco el controlador para acceder a la base de datos y
    //si hay coincidencia envia error debido a que registrar solo se puede una vez
    const user = new UserController();
    const userExist = await user.controllerFindUser(request.filterFindUser);

    if (!userExist) {
      await user.controllerUpdateUser(
        request.filterCreateOrUpdateUser,
        request.obj,
        request.options
      );
      sendEmail({ ...req.body, generateCode });
      next();
      return res.status(200).json(req.body.email);
    } else {
      next();
      return res.status(409).json("el usuario ya existe");
    }
  } catch (error) {
    console.log(error);
    next();
    return res
      .status(404)
      .json("Error");
  }
};

export const registerApiConfirm = async (req, res, next) => {
  const { email, code } = req.body;
  try {
    //Se crea el objeto con filtro y objeto con modificaciones
    const request = {
      filter: { "account.code": code, email },
      obj: { "account.status": true, "account.code": null },
    };
    //Se llama al controlador para verificar la coincidencia del codigo y email
    // para enviar si se puede authenticar o si ya lo esta o no existe
    const user = new UserController();
    const useRes = await user.controllerUpdateUser(request.filter, request.obj);
    if (!useRes)
      throw new Error("El correo no existe o el codigo es incorrecto.");
  } catch (error) {
    next();
    return res.status(409).json(error.message);
  }
  next();
  return res.status(200).json("Auth exitosa");
};

export const loginApi = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    //Se crean las variables a utilizar y el objeto de la peticion con su filtro y objeto
    const acces = uuidv4().split("-").join("");
    const refresh = uuidv4().split("-").join("");
    const request = {
      filterFindUser: {
        $and: [
          { $or: [{ email: username }, { nickname: username }] },
          { password },
          { "account.status": true },
        ],
      },
      filterFindUser: {
        $and: [
          { $or: [{ email: username }, { nickname: username }] },
          { password },
          { "account.status": true },
        ],
      },
      obj: {
        acces_token: {
          code: acces,
          date: new Date(Date.now() + hours.week),
        },
        $push: {
          "refresh_tokens.tokens": {
            code: refresh,
            date: new Date(Date.now() + hours.hours6),
            ip: req.ip,
          },
        },
      },
      options: { upsert: true },
    };

    console.log(refresh)
    const jwtRefresh = jwt.sign(refresh, process.env.SECRET_KEY);
    //Se llama al controlador para actualizar
    //si hay coincidencia los campos dados,
    //esto se da en el caso de que una de que coincidan los 3 filtros
    const user = new UserController();
    const userRes = await user.controllerFindUser(request.filterFindUser);
    if (!userRes) {
      next();
      return res.status(404).json("No se encontro registro");
    }
    // if (!tokenRes) throw new Error("Error en contraseña o usuario");
    // cookiesConfig.maxAge = hours.refresh;
    const token = new TokenController();
    await token.controllerUpdateToken(
      { id_DB: userRes.id },
      request.obj,
      request.options
    );
    res.cookie("refresh", jwtRefresh, cookiesConfig);
    next();
    return res.status(200).json("Logueo exitoso");
  } catch (error) {
    next();
    return res.status(404).json(error.message);
  }
};
