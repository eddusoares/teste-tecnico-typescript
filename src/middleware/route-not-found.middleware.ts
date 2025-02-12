import express, { NextFunction, Request, Response } from "express";
import { NotFoundError } from "../errors/not-found.error";

export const routeNotFoundHandler = (app: express.Express) => {
    app.use((req: Request, res: Response, next: NextFunction) => {
        next(new NotFoundError("Rota não encontrada!"));
    });
};