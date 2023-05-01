import Express from "express";
import Router from "./routes/routes.js";

const app = Express();
const port = 3005;

app.use(Router);

app.listen(port, () => console.log(`Running in the port: ${port}`));
