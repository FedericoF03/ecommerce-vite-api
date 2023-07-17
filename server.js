import * as dotenv from "dotenv";

import Express from "express";
import Router from "./src/Routes/routes.js";
import morgan from "morgan";
import CORS from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

import DBConnect, { DBdisconnect } from "./src/middlewares/DB.js";
dotenv.config();
const app = Express();
const port = 3005;
const logger = morgan("tiny");

// app.set("trust proxy", true);

app.use(bodyParser.json());
app.use(
  CORS({
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(logger);
app.use(DBConnect);
app.use(Router);
app.use(DBdisconnect)
app.listen(port, () => console.log(`Running in the port: ${port}`));
