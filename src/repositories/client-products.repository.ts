import { database } from "../infrastructure/database";
import { ClientModel } from "../models/client.model";
import { ProductModel } from "../models/product.model";

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

    async getAll(clientId: number): Promise<ProductModel[] | undefined> {
        const snapshot = await this.clientDatabase.find(client => client.id = clientId)?.produtosContratados;
        if (!snapshot) {
            throw new Error("Cliente não possui produtos")
        }
        return snapshot;
    }

    async getById(id: string): Promise<ClientModel | null> {
        const client = await this.clientDatabase.find((client) => client.id === Number(id));
        return client ?? null
    }

    async create(productName: string, clientId: number): Promise<void> {
        const product = await this.productDatabase.find(product => product.nome === productName);
        const clientIndex = await this.clientDatabase.findIndex(clients => clients.id === clientId);
        console.log(productName)
        console.log(product)
        console.log(clientIndex)
        if (!product || isNaN(clientIndex)) {
            throw new Error
        }
        this.clientDatabase[clientIndex].produtosContratados.push(product);
    }

    async update(client: ClientModel, clientId: number): Promise<void> {
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