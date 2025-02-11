import { NotFoundError } from "../errors/not-found.error";
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

    async getByName(productName: string): Promise<Product> {
        const product = await this.productRepository.getByName(productName);
        if(!product){
            throw new NotFoundError("Produto não encontrado!")
        }
        return product;
    }

}