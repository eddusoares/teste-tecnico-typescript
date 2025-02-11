import { Router } from 'express';
import asyncHandler from 'express-async-handler'
import { ClientController } from '../controllers/client.controller';
import { ClientProductsController } from '../controllers/client-products.controller';
export const clientRoutes = Router();

//Rotas CRUD clientes
//Listar todos os clientes
clientRoutes.get('/clients', asyncHandler(ClientController.getAll));
//Listar cliente pelo ID
clientRoutes.get('/clients/:id', asyncHandler(ClientController.getById));
//Cadastrar cliente na lista
clientRoutes.post('/clients', ClientController.create);
//Atualizar cliente pelo ID
clientRoutes.put('/clients/:id', ClientController.update);
//Deletar cliente pelo ID
clientRoutes.delete('/clients/:id', asyncHandler(ClientController.delete));

//Rotas Crud Produtos por cliente
//Contratar produto para um Cliente
clientRoutes.post('/clients/:id/products', asyncHandler(ClientProductsController.create));
//Listar produtos de um cliente
clientRoutes.get('/clients/:id/products', asyncHandler(ClientProductsController.getAll));
//Deletar produto de um cliente
clientRoutes.delete('/clients/:id/products/:productid', asyncHandler(ClientProductsController.delete));
