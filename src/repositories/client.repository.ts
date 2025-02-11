import { database } from "../infrastructure/database";
import { ClientModel } from "../models/client.model";

export class ClientRepository {
    private clientDatabase;

    constructor() {
        this.clientDatabase = database.clients;
    }

    getLastId(): number {
        return this.clientDatabase[this.clientDatabase.length - 1].id;
    }

    async getAll(): Promise<ClientModel[]> {
        const snapshot = await this.clientDatabase;
        return snapshot;
    }

    async getById(id: number): Promise<ClientModel | null> {
        const client = await this.clientDatabase.find((client) => client.id === id);
        return client ?? null
    }

    async create(client: ClientModel): Promise<void> {
        await this.clientDatabase.push(client);
    }

    async update(client: ClientModel, clientId: number): Promise<void> {
        const clientIndex = await this.clientDatabase.findIndex(clients => clients.id === clientId);
        client.id = this.clientDatabase[clientIndex].id;
        this.clientDatabase[clientIndex] = client;
    }

    async delete(clientId: number): Promise<void> {
        const clientIndex = await this.clientDatabase.findIndex(clients => clients.id === clientId);
        this.clientDatabase.splice(clientIndex, 1);
    }

}