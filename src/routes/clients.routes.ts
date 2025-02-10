import { Router } from 'express';
export const clientsRoutes = Router();

//Rotas CRUD clientes
//Listar todos os clientes
clientsRoutes.get('/clients');
//Listar cliente pelo ID
clientsRoutes.get('/clients/:id');
//Cadastrar cliente na lista
clientsRoutes.post('/clients');
//Atualizar cliente pelo ID
clientsRoutes.put('/clients/:id');
//Deletar cliente pelo ID
clientsRoutes.delete('/clients/:id');

//Rotas Crud Produtos por cliente
//Contratar produto para um Cliente
clientsRoutes.post('/clients/:id/products');
//Listar produtos de um cliente
clientsRoutes.get('/clients/:id/products');
//Deletar produto de um cliente
clientsRoutes.delete('/clients/:id/products/:id');
