import { ClientProductModel } from "../models/client-product.model";
import { ClientModel } from "../models/client.model";
import { ProductModel } from "../models/product.model";
import { ClientProductsRepository } from "../repositories/client-products.repository";

export class ClientProductsService {
    private clientProductsRepository: ClientProductsRepository;

    constructor(){
        this.clientProductsRepository = new ClientProductsRepository();
    }

    async getAll(clientId: number): Promise<ProductModel[] | undefined> {
        return this.clientProductsRepository.getAll(clientId);
    }

    async getById(id: string): Promise<ClientModel> {
        const client = await this.clientProductsRepository.getById(id);
        if(!client){
            throw new Error("Cliente não encontrado")
        }
        return client;
    }

    async create(productName: ClientProductModel, clientId: number): Promise<void> {
        const _productName = productName.productName;
        await this.clientProductsRepository.create(_productName, clientId)
    }

    async update(client: ClientModel, clientId: string): Promise<void> {
        await this.clientProductsRepository.update(client, Number(clientId));
    }

    async delete(clientId: number, productId: number): Promise<void> {
        await this.clientProductsRepository.delete(clientId, productId);
    }

}