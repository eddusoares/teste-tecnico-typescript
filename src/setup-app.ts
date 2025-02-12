import express from 'express';
import { routes } from './routes';
import { routeNotFoundHandler } from './middleware/route-not-found.middleware';
import { errorHandler } from './middleware/error-handler.middleware';

export function setupApp() {
  const app = express();

  routes(app);
  routeNotFoundHandler(app);
  errorHandler(app);

  return app;
}
