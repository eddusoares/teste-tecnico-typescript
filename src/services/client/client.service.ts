import { NotFoundError } from '../../errors/not-found.error';
import { Client } from '../../models/client.model';
import { ClientRepository } from '../../repositories/client.repository';

export class ClientService {
  constructor(private readonly clientRepository = new ClientRepository()) {}

  async getAllClients(): Promise<Client[]> {
    return this.clientRepository.getAllClients();
  }

  async getClientById(id: number): Promise<Client> {
    const client = await this.clientRepository.getById(id);
    if (!client) {
      throw new NotFoundError('Cliente não encontrado!');
    }
    return client;
  }

  async create(client: Client): Promise<void> {
    client.id = this.getNewId();
    await this.clientRepository.create(client);
  }

  async update(client: Client, clientId: number): Promise<void> {
    const _client = await this.getClientById(clientId);
    if (_client) {
      client.produtosContratados = _client.produtosContratados;
      await this.clientRepository.update(client, clientId);
    }
  }
  async delete(clientId: number): Promise<void> {
    const _client = await this.getClientById(clientId);
    if (_client) {
      await this.clientRepository.delete(clientId);
    }
  }

  private getNewId(): number {
    return this.clientRepository.getLastId() + 1;
  }
}
