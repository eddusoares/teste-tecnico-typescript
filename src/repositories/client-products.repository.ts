import { database } from "../infrastructure/database";
import { Client } from "../models/client.model";
import { Product } from "../models/product.model";
import { ProductService } from "../services/product.service";

export class ClientProductsRepository {
    private clientDatabase;
    private productDatabase;

    constructor() {
        this.clientDatabase = database.clients;
        this.productDatabase = database.products;
    }

    getLastId(): number {
        return this.clientDatabase[this.clientDatabase.length - 1].id;
    }

    async getAll(clientId: number): Promise<Product[] | undefined> {
        const snapshot = await this.clientDatabase.find(client => client.id = clientId)?.produtosContratados;
        if (!snapshot) {
            throw new Error("Cliente não possui produtos")
        }
        return snapshot;
    }

    async getById(id: number): Promise<Client | null> {
        const client = await this.clientDatabase.find((client) => client.id === id);
        return client ?? null
    }

    async create(product: Product, clientId: number): Promise<void> {
        const clientIndex = await this.clientDatabase.findIndex(clients => clients.id === clientId);
        product.id = (await new ProductService().getByName(product.nome)).id;
        this.clientDatabase[clientIndex].produtosContratados.push(product);
    }

    async update(client: Client, clientId: number): Promise<void> {
        const clientIndex = await this.clientDatabase.findIndex(clients => clients.id === clientId);
        client.id = this.clientDatabase[clientIndex].id;
        this.clientDatabase[clientIndex] = client;
    }

    async delete(clientId: number, productId: number): Promise<void> {
        const clientIndex = await this.clientDatabase.findIndex(clients => clients.id === clientId);
        const productIndex = await this.productDatabase.findIndex(product => product.id === productId);
        this.clientDatabase[clientIndex].produtosContratados.splice(productIndex, 1);
    }




}