import {
  base64URLEncode,
  sha256,
  generateState,
} from "../../middlewares/URLEncode.js";

export const login = async (req, res) => {
  try {
    //checkeo si existe verifier, si no es el caso 
    // significa que hubo un problema y no fue encontrado
    if (!req.cookies?.verifier) throw new Error("Verifier not found");
    //config de peticion
    const httpConfig = {
      url: "https://api.mercadolibre.com/oauth/token",
      body: {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/x-www-form-urlencoded",
        },
        body: `grant_type=authorization_code&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&code=${
          req.query.code
        }&redirect_uri=http://localhost:3000/auth/authorization&code_verifier=${
          req.cookies.verifier
        }`,
      },
    };
    //se hace la peticion para obtener el acces token o en su defecto rechazar
    const acces = await fetch(httpConfig.url, httpConfig.body);
    const resAcces = await acces.json();
    if (resAcces.status === 400) throw new Error("Error en la Autenticacion");
    //Todo procedio bien entonces se borra la cookie verifier, 
    // y se crean las de uso una con duraccion de 6 horas
    const hours = {
      acces: 1000 * 60 * 60 * 6 ,
      refresh: 1000 * 60 * 60 * 24 * 7
    }
    res.clearCookie("verifier")
    res.cookie("access", resAcces.access_token, {
      httpOnly: true,
      secure: true,
      maxAge: hours.acces
    });
    res.cookie("refresh", resAcces.refresh_token, {
      httpOnly: true,
      secure: true,
      maxAge: hours.refresh
    });
    //Enviar un status 200 para indicar que todo procedio bien 
    // y desarrollar logica de redireccion con el path en un json
    res.status(200).json("/");
  } catch (error) {
    res.status(404).json(error.message);
  }
};

export const register = (req, res, next) => {
  const local = "http://localhost:3000/auth/authorization";
  try {
    //Checkea si existe el query code, si es asi se va a la siguiente function Login
    if (req.query?.code) return next();
    //No existe crea el verifier para generar el challemge
    // y almacena en cookie segura y interceptable solo en peticiones HTTP
    const verifier = base64URLEncode();
    res.cookie("verifier", verifier, { httpOnly: true, secure: true });
    const challenge = base64URLEncode(sha256(verifier));
    //creo el state para generar seguridad extra
    const state = generateState();
    const url = `https://auth.mercadolibre.com.ar/authorization?response_type=code&client_id=${process.env.CLIENT_ID}&redirect_uri=${local}&code_challenge=${challenge}&code_challenge_method=S256&state=${state}`;
    res.status(200).json(url);
  } catch (error) {
    console.log(error)
    res.status(404).json("Error")
  }
};
