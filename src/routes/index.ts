import express from 'express';
import { clientRoutes } from './client.routes';

export const routes = (app: express.Express) => {
    app.use(express.json());
    app.use(clientRoutes);
}