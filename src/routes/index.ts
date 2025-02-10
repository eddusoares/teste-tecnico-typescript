import express from 'express';
import { clientsRoutes } from './clients.routes';

export const routes = (app: express.Express) => {
    app.use(express.json());
    app.use(clientsRoutes);
}