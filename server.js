import * as dotenv from 'dotenv'

import Express from "express";
import Router from './src/Routes/routes.js';
import morgan from "morgan";
import CORS from "cors"
import cookieParser from "cookie-parser";
import bodyParser from "body-parser"
dotenv.config()
const app = Express();
const port = 3005;
const logger = morgan("tiny");

app.use(bodyParser.json())
app.use(CORS({
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
  credentials: true
}))
app.use(cookieParser())
app.use(logger)
app.use(Router);
app.listen(port, () => console.log(`Running in the port: ${port}`));
