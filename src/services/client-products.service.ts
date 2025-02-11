import { NotFoundError } from "../errors/not-found.error";
import { ValidationError } from "../errors/validation.error";
import { ClientProductModel } from "../models/client-product.model";
import { Client } from "../models/client.model";
import { Product } from "../models/product.model";
import { ClientProductsRepository } from "../repositories/client-products.repository";
import { ClientService } from "./client.service";
import { ProductService } from "./product.service";

export class ClientProductsService {
    private clientProductsRepository: ClientProductsRepository;

    constructor() {
        this.clientProductsRepository = new ClientProductsRepository();
    }

    async getAll(clientId: number): Promise<Product[] | undefined> {
        const client = await this.clientProductsRepository.getById(clientId);
        if (!client) {
            throw new NotFoundError("Cliente não encontrado!")
        }
        return this.clientProductsRepository.getAll(clientId);
    }

    async create(productName: ClientProductModel, clientId: number): Promise<void> {
        const _clientId = await new ClientService().getById(clientId);
        const product = await new ProductService().getByName(productName);
        if (!product) {
            throw new ValidationError("Produto não encontrado para este cliente!");
        }
        if(this.comparaTipoClienteTipoProduto(_clientId.tipoCliente, product.nome)){
            //produto especifico pode ser contratado
        }
        
        await this.clientProductsRepository.create(product, _clientId.id)
    }

    async update(client: Client, clientId: string): Promise<void> {
        await this.clientProductsRepository.update(client, Number(clientId));
    }

    async delete(clientId: number, productId: number): Promise<void> {
        await this.clientProductsRepository.delete(clientId, productId);
    }

    getValorTotalAplicadoPorCliente(client: Client): number {
        const valorTotal = client.produtosContratados.reduce(
            (acc, { valorAplicado }) => acc + valorAplicado, 0
        )
        return valorTotal;
    }

    comparaTipoClienteTipoProduto(tipoCliente: string, nomeProduto: string): boolean {
        switch (tipoCliente) {
            case "PF":
                if (nomeProduto === "RF-01" || nomeProduto === "RD-03") {
                    return true
                }
                break;
            case "PJ":
                if (nomeProduto === "RF-02" || nomeProduto === "RD-03") {
                    return true
                }
                break;
        }
        return false;
    }




}