import express from "express";
import { routes } from "./routes";
import { pageNotFoundHandler } from "./middleware/page-not-found.middleware";
import { errorHandler } from "./middleware/error-handler.middleware";



const app = express();

routes(app);
pageNotFoundHandler(app);
errorHandler(app);

app.listen(3200, () => {
    console.log("Servidor ativo na porta 3200");
});
