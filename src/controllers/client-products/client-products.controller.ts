import { Request, Response } from 'express';
import { ClientProductsService } from '../../services/client-product/client-products.service';

export class ClientProductsController {
  static async getAll(req: Request, res: Response) {
    let clientId = Number(req.params.id);
    res.send(await new ClientProductsService().gelAllClientProducts(clientId));
  }

  static async create(req: Request, res: Response) {
    let clientId = Number(req.params.id);
    await new ClientProductsService().create(req.body, clientId);
    res.status(201).send({
      message: 'Produto cadastrado com sucesso!',
    });
  }

  static async delete(req: Request, res: Response) {
    let clientId = Number(req.params.id);
    let productId = Number(req.params.productid);
    await new ClientProductsService().delete({ clientId, productId });
    res.send({
      message: 'Produto excluído com sucesso!',
    });
  }
}
