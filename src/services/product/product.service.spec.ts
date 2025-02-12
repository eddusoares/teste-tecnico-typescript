import { ProductService } from './product.service';
import { ProductRepository } from '../../repositories/product.repository';
import { BadRequestError } from '../../errors/bad-request.error';
import { Product } from '../../models/product.model';

jest.mock('../../repositories/product.repository');

describe('ProductService', () => {
  let productService: ProductService;
  let productRepository: jest.Mocked<ProductRepository>;

  beforeEach(() => {
    productRepository = new ProductRepository() as jest.Mocked<ProductRepository>;
    productService = new ProductService();
    (productService as any).productRepository = productRepository;
  });

  describe('getAll', () => {
    it('should return all products', async () => {
      const products: Product[] = [
        {
          id: 1,
          nome: 'Product 1',
          valorAplicado: 1000,
          tipoCliente: 'PF',
          taxaDeRetorno: 0.1,
          dataDeVencimento: '01012026',
        },
      ];
      productRepository.getAll.mockResolvedValue(products);

      const result = await productService.getAll();

      expect(result).toEqual(products);
      expect(productRepository.getAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('getByName', () => {
    it('should return the product if it exists', async () => {
      const product: Product = {
        id: 1,
        nome: 'Product 1',
        valorAplicado: 1000,
        tipoCliente: 'PF',
        taxaDeRetorno: 0.1,
        dataDeVencimento: '01012026',
      };
      productRepository.getByName.mockResolvedValue(product);

      const result = await productService.getByName('Product 1');

      expect(result).toEqual(product);
      expect(productRepository.getByName).toHaveBeenCalledWith('Product 1');
    });

    it('should throw BadRequestError if the product does not exist', async () => {
      productRepository.getByName.mockResolvedValue(null);

      await expect(productService.getByName('Nonexistent Product')).rejects.toThrow(BadRequestError);
      expect(productRepository.getByName).toHaveBeenCalledWith('Nonexistent Product');
    });
  });

  describe('getById', () => {
    it('should return the product if it exists', async () => {
      const product: Product = {
        id: 1,
        nome: 'Product 1',
        valorAplicado: 1000,
        tipoCliente: 'PF',
        taxaDeRetorno: 0.1,
        dataDeVencimento: '01012026',
      };
      productRepository.getById.mockResolvedValue(product);

      const result = await productService.getById(1);

      expect(result).toEqual(product);
      expect(productRepository.getById).toHaveBeenCalledWith(1);
    });

    it('should throw BadRequestError if the product does not exist', async () => {
      productRepository.getById.mockResolvedValue(null);

      await expect(productService.getById(999)).rejects.toThrow(BadRequestError);
      expect(productRepository.getById).toHaveBeenCalledWith(999);
    });
  });
});
