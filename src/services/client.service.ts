import { NotFoundError } from "../errors/not-found.error";
import { ValidationError } from "../errors/validation.error";
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
        if(this.getTipoCliente(client) === "PF" && client.cnpj !== null ){
            throw new ValidationError("Cliente do tipo Pessoa Física não pode ter um CNPJ!")
        }
        if(this.getTipoCliente(client) === "PJ" && client.cpf !== null ){
            throw new ValidationError("Cliente do tipo Pessoa Jurídica não pode ter um CPF!")
        }
        const _client = await this.getById(clientId);
        if (_client) {
            await this.clientRepository.update(client, clientId);
        }
    }
    async delete(clientId: number): Promise<void> {
        await this.clientRepository.delete(clientId);
    }   

    getTipoCliente(client: Client): string {
        return client.tipoCliente;
    }

}