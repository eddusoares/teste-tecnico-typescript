import { NotFoundError } from "../errors/not-found.error";
import { ValidationError } from "../errors/validation.error";
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

    async create(product: Product, clientId: number): Promise<void> {
        const client = await new ClientService().getById(clientId);
        const _product = await new ProductService().getByName(product.nome);
        if (_product) {
            const aplicTotalClient = this.getValorTotalAplicadoPorCliente(client);
            const valorTotalClient = this.getRendaTotalCliente(client);
            const percentClient = this.getPercentualRenda(aplicTotalClient, valorTotalClient, product.valorAplicado);

            if (this.comparaTipoClienteTipoProduto(client.tipoCliente, product.nome)) {
                if(this.decideContratacaoProduto(percentClient, product.nome, client.tipoCliente)){
                await this.clientProductsRepository.create(product, client.id)
            } else {
                throw new ValidationError("Este cliente não pode contratar esse produto, o valor da aplicação passa do estipulado da renda total!")
            }
            } else {
                throw new ValidationError("Este produto não pode ser contratado para este tipo de Cliente!");
            }
        } else {
            throw new ValidationError("Produto não encontrado para este cliente!");
        }
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

    getRendaTotalCliente(client:Client): number {
        return client.tipoCliente === "PF" ? client.rendaAnual : client.faturamentoAnual;        
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

    getPercentualRenda(valorTotal: number, rendaTotal: number, productValor: number): number{
                return ((valorTotal + productValor) / rendaTotal) * 100;
    }

    decideContratacaoProduto(percentualRenda: number, productName: string, tipoCliente: string): boolean{
        console.log(percentualRenda);
        switch(productName){
            case "RF-01":
                if(percentualRenda < 50){
                    return true
                }
                return false
            case "RF-02":
                if(percentualRenda < 70){
                    return true
                }
                return false;
            case "RF-03":
                if(tipoCliente === "PF"){
                    if(percentualRenda < 50){
                        return true;
                    }
                }
                if(tipoCliente === "PJ"){
                    if(percentualRenda < 70){
                        return true;
                    }
                }
                return false
        }
        return false;
    }



}