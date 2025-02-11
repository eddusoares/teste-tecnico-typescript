import { NotFoundError } from "../errors/not-found.error";
import { Client } from "../models/client.model";
import { ClientRepository } from "../repositories/client.repository";

export class ClientService {
    private clientRepository: ClientRepository;

    constructor() {
        this.clientRepository = new ClientRepository();
    }

    newId(): number {
        return this.clientRepository.getLastId() + 1;
    }

    async getAll(): Promise<Client[]> {
        return this.clientRepository.getAll();
    }

    async getById(id: number): Promise<Client> {
        const client = await this.clientRepository.getById(id);
        if (!client) {
            throw new NotFoundError("Cliente não encontrado!")
        }
        return client;
    }

    async create(client: Client): Promise<void> {
        client.id = this.newId();
        await this.clientRepository.create(client)
    }

    async update(client: Client, clientId: number): Promise<void> {
        const _client = await this.getById(clientId);
        if (_client) {
            client.produtosContratados = _client.produtosContratados;
            await this.clientRepository.update(client, clientId);
        }
    }
    async delete(clientId: number): Promise<void> {
        const _client = await this.getById(clientId);
        if (_client) {
        await this.clientRepository.delete(clientId);
        }
    }   

    getTipoCliente(client: Client): string {
        return client.tipoCliente;
    }

}