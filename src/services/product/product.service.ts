import { BadRequestError } from '../../errors/bad-request.error';
import { Product } from '../../models/product.model';
import { ProductRepository } from '../../repositories/product.repository';

export class ProductService {
  private productRepository: ProductRepository;

  constructor() {
    this.productRepository = new ProductRepository();
  }

  async getAll(): Promise<Product[]> {
    return this.productRepository.getAll();
  }

  async getByName(productName: string): Promise<Product> {
    const product = await this.productRepository.getByName(productName);
    if (!product) {
      throw new BadRequestError('Produto não existe!');
    }
    return product;
  }

  async getById(productId: number): Promise<Product | null> {
    const product = await this.productRepository.getById(productId);
    if (!product) {
      throw new BadRequestError('Produto não existe');
    }
    return product;
  }
}
