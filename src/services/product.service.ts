import { NotFoundError } from "../errors/not-found.error";
import { ClientProductModel } from "../models/client-product.model";
import { Product } from "../models/product.model";
import { ProductRepository } from "../repositories/product.repository";

export class ProductService {
    private productRepository: ProductRepository;

    constructor(){
        this.productRepository = new ProductRepository();
    }

    async getAll(): Promise<Product[]> {
        return this.productRepository.getAll();
    }

    async getByName(productName: ClientProductModel): Promise<Product> {
        const _productName = productName.nome;
        console.log(_productName)
        const product = await this.productRepository.getByName(_productName);
        if(!product){
            throw new NotFoundError("Produto não encontrado!")
        }
        return product;
    }

}