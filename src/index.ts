import express from "express";
import { routes } from "./routes";
import { routeNotFoundHandler } from "./middleware/route-not-found.middleware";
import { errorHandler } from "./middleware/error-handler.middleware";



const app = express();

routes(app);
routeNotFoundHandler(app);
errorHandler(app);

app.listen(3200, () => {
    console.log("Servidor ativo na porta 3200");
});
