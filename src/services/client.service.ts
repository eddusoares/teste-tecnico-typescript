import { ClientModel } from "../models/client.model";
import { ClientRepository } from "../repositories/client.repository";

export class ClientService {
    private clientRepository: ClientRepository;

    constructor(){
        this.clientRepository = new ClientRepository();
    }

    newId(): number{
        return this.clientRepository.getLastId() + 1;
    }

    async getAll(): Promise<ClientModel[]> {
        return this.clientRepository.getAll();
    }

    async getById(id: string): Promise<ClientModel> {
        const client = await this.clientRepository.getById(id);
        if(!client){
            throw new Error("Cliente não encontrado")
        }
        return client;
    }

    async create(client: ClientModel): Promise<void> {
        client.id = this.newId();
        await this.clientRepository.create(client)
    }
    async update(client: ClientModel, clientId: string): Promise<void> {
        await this.clientRepository.update(client, Number(clientId));
    }
    async delete(clientId: number): Promise<void> {
        await this.clientRepository.delete(clientId);
    }

}