import { Request, Response } from 'express';
import { ClientService } from '../../services/client/client.service';

export class ClientController {
  static async getAll(req: Request, res: Response) {
    res.send(await new ClientService().getAllClients());
  }

  static async getById(req: Request, res: Response) {
    const clientId = Number(req.params.id);
    res.send(await new ClientService().getClientById(clientId));
  }

  static async create(req: Request, res: Response) {
    await new ClientService().create(req.body);
    res.status(201).send({
      message: 'Usuário criado com sucesso!',
    });
  }

  static async update(req: Request, res: Response) {
    let clientId = Number(req.params.id);
    let client = req.body;
    await new ClientService().update(client, clientId);
    res.send({
      message: 'Usuário alterado com sucesso!',
    });
  }

  static async delete(req: Request, res: Response) {
    let clientId = Number(req.params.id);
    await new ClientService().delete(clientId);
    res.send({
      message: 'Usuário excluído com sucesso!',
    });
  }
}
