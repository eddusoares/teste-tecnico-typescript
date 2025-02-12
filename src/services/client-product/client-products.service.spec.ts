import { ClientProductsRepository } from '../../repositories/client-products.repository';
import { ClientProductsService } from './client-products.service';
import { Product } from '../../models/product.model';
import { mock } from 'jest-mock-extended';
import { ProductRepository } from '../../repositories/product.repository';
import { ClientService } from '../client/client.service';
import { ProductService } from '../product/product.service';
import { ValidationError } from '../../errors/validation.error';
import { BadRequestError } from '../../errors/bad-request.error';
import { buildClient } from '../../utils/test/builders/build-client';

describe('ClientProductsService', () => {
  const clientProductsRepo = mock<ClientProductsRepository>();
  const productRepo = mock<ProductRepository>();
  const clientService = mock<ClientService>();
  const productService = mock<ProductService>();

  const sut = new ClientProductsService(clientProductsRepo, productRepo, clientService, productService);

  const buildProduct = (data?: Partial<Product>): Product => {
    const object = {
      id: 0,
      nome: '',
      valorAplicado: 0,
      ...data,
    };

    return new Product(object);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe(sut.gelAllClientProducts.name, () => {
    describe('ALWAYS', () => {
      beforeEach(async () => {
        await sut.gelAllClientProducts(123).catch((err) => null);
      });

      it('SHOULD call clientProductsRepository.getAll with passed clientId', () => {
        expect(clientProductsRepo.getAll).toHaveBeenCalledTimes(1);
        expect(clientProductsRepo.getAll).toHaveBeenCalledWith(123);
      });
    });
  });

  describe(sut.create.name, () => {
    const client = buildClient({
      id: 123,
      tipoCliente: 'PF',
    });
    const product = buildProduct({
      nome: 'RF-01',
      valorAplicado: 1_000_000,
    });

    describe('WHEN client type cannot contract product', () => {
      let expectedError: Error;
      beforeEach(async () => {
        clientService.getClientById.mockResolvedValueOnce(client);

        jest.spyOn(sut, 'comparaTipoClienteTipoProduto').mockReturnValueOnce(false);
        await sut.create(product, 123).catch((err) => (expectedError = err));
      });
      it('SHOULD throw a ValidationError', () => {
        expect(expectedError).toEqual(
          new ValidationError('Este produto não pode ser contratado para este tipo de Cliente!'),
        );
      });
    });

    describe('WHEN client TYPE CAN contract product', () => {
      beforeEach(() => {
        clientService.getClientById.mockResolvedValueOnce(client);
        jest.spyOn(sut, 'comparaTipoClienteTipoProduto').mockReturnValueOnce(true);
      });

      describe('AND the client cannot afford the product', () => {
        let expectedError: Error;
        beforeEach(async () => {
          jest.spyOn(sut, 'getValorTotalAplicadoPorCliente').mockReturnValueOnce(100_000);
          jest.spyOn(sut, 'getRendaTotalCliente').mockReturnValueOnce(1_000_000);
          jest.spyOn(sut, 'getPercentualRenda').mockReturnValueOnce(50);

          jest.spyOn(sut, 'decideContratacaoProduto').mockReturnValueOnce(false);

          await sut.create(product, 123).catch((err) => (expectedError = err));
        });

        it('SHOULD throw a ValidationError', async () => {
          expect(expectedError).toEqual(
            new ValidationError(
              'Este cliente não pode contratar esse produto, o valor da aplicação passa do estipulado da renda total!',
            ),
          );
        });
      });

      describe('AND the client CAN afford the product', () => {
        beforeEach(async () => {
          jest.spyOn(sut, 'getValorTotalAplicadoPorCliente').mockReturnValueOnce(100_000);
          jest.spyOn(sut, 'getRendaTotalCliente').mockReturnValueOnce(1_000_000);
          jest.spyOn(sut, 'getPercentualRenda').mockReturnValueOnce(10);

          jest.spyOn(sut, 'decideContratacaoProduto').mockReturnValueOnce(true);

          await sut.create(product, 123);
        });

        it('SHOULD call clientProductsRepo.create with the product and clientId', () => {
          expect(clientProductsRepo.create).toHaveBeenCalledTimes(1);
          expect(clientProductsRepo.create).toHaveBeenCalledWith(product, 123);
        });
      });
    });
  });

  describe(sut.delete.name, () => {
    describe('WHEN product is not found / is null', () => {
      let expectedError: Error;
      beforeEach(async () => {
        productRepo.getById.mockResolvedValueOnce(null);
        await sut
          .delete({
            clientId: 123,
            productId: 456,
          })
          .catch((err) => (expectedError = err));
      });

      it('SHOULD throw BadRequestError', () => {
        expect(expectedError).toEqual(new BadRequestError('O Produto solicitado não existe!'));
      });
    });

    describe('WHEN product is found', () => {
      beforeEach(async () => {
        productRepo.getById.mockResolvedValueOnce(buildProduct());
        await sut.delete({ clientId: 1234, productId: 4567 });
      });
      it('SHOULD call clientProductsRepo.delete', () => {
        expect(clientProductsRepo.delete).toHaveBeenCalledTimes(1);
        expect(clientProductsRepo.delete).toHaveBeenCalledWith(1234, 4567);
      });
    });
  });

  describe('getValorTotalAplicadoPorCliente', () => {
    it('SHOULD return the sum of valorAplicado from all products', () => {
      const client = buildClient({
        produtosContratados: [
          buildProduct({ valorAplicado: 100 }),
          buildProduct({ valorAplicado: 200 }),
          buildProduct({ valorAplicado: 300 }),
        ],
      });

      expect(sut.getValorTotalAplicadoPorCliente(client)).toBe(600);
    });
  });

  describe('getRendaTotalCliente', () => {
    it('SHOULD return rendaAnual if tipoCliente is PF', () => {
      const client = buildClient({
        tipoCliente: 'PF',
        rendaAnual: 1000,
      });

      expect(sut.getRendaTotalCliente(client)).toBe(1000);
    });

    it('SHOULD return faturamentoAnual if tipoCliente is PJ', () => {
      const client = buildClient({
        tipoCliente: 'PJ',
        faturamentoAnual: 1000,
      });

      expect(sut.getRendaTotalCliente(client)).toBe(1000);
    });
  });

  describe('comparaTipoClienteTipoProduto', () => {
    it('SHOULD return true if tipoCliente is PF and nomeProduto is RF-01', () => {
      expect(sut.comparaTipoClienteTipoProduto('PF', 'RF-01')).toBe(true);
    });

    it('SHOULD return true if tipoCliente is PF and nomeProduto is RD-03', () => {
      expect(sut.comparaTipoClienteTipoProduto('PF', 'RD-03')).toBe(true);
    });

    it('SHOULD return true if tipoCliente is PJ and nomeProduto is RF-02', () => {
      expect(sut.comparaTipoClienteTipoProduto('PJ', 'RF-02')).toBe(true);
    });

    it('SHOULD return true if tipoCliente is PJ and nomeProduto is RD-03', () => {
      expect(sut.comparaTipoClienteTipoProduto('PJ', 'RD-03')).toBe(true);
    });

    it('SHOULD return false if tipoCliente is PF and nomeProduto is RF-02', () => {
      expect(sut.comparaTipoClienteTipoProduto('PF', 'RF-02')).toBe(false);
    });

    it('SHOULD return false if tipoCliente is PF and nomeProduto is RD-02', () => {
      expect(sut.comparaTipoClienteTipoProduto('PF', 'RD-02')).toBe(false);
    });

    it('SHOULD return false if tipoCliente is PJ and nomeProduto is RF-01', () => {
      expect(sut.comparaTipoClienteTipoProduto('PJ', 'RF-01')).toBe(false);
    });

    it('SHOULD return false if tipoCliente is PJ and nomeProduto is RD-02', () => {
      expect(sut.comparaTipoClienteTipoProduto('PJ', 'RD-02')).toBe(false);
    });
  });

  describe('getPercentualRenda', () => {
    it('SHOULD return the percentage of valorTotal + productValor over rendaTotal', () => {
      expect(sut.getPercentualRenda(100, 1000, 100)).toBe(20);
    });
  });

  describe('decideContratacaoProduto', () => {
    it('SHOULD return true if productName is RF-01 and percentualRenda is less than 50', () => {
      expect(sut.decideContratacaoProduto(49, 'RF-01', 'PF')).toBe(true);
    });

    it('SHOULD return false if productName is RF-01 and percentualRenda is 50', () => {
      expect(sut.decideContratacaoProduto(50, 'RF-01', 'PF')).toBe(false);
    });

    it('SHOULD return true if productName is RF-02 and percentualRenda is less than 70', () => {
      expect(sut.decideContratacaoProduto(69, 'RF-02', 'PJ')).toBe(true);
    });

    it('SHOULD return false if productName is RF-02 and percentualRenda is 70', () => {
      expect(sut.decideContratacaoProduto(70, 'RF-02', 'PJ')).toBe(false);
    });

    it('SHOULD return true if productName is RF-03, tipoCliente is PF and percentualRenda is less than 50', () => {
      expect(sut.decideContratacaoProduto(49, 'RF-03', 'PF')).toBe(true);
    });

    it('SHOULD return false if productName is RF-03, tipoCliente is PF and percentualRenda is 50', () => {
      expect(sut.decideContratacaoProduto(50, 'RF-03', 'PF')).toBe(false);
    });

    it('SHOULD return true if productName is RF-03, tipoCliente is PJ and percentualRenda is less than 70', () => {
      expect(sut.decideContratacaoProduto(69, 'RF-03', 'PJ')).toBe(true);
    });

    it('SHOULD return false if productName is RF-03, tipoCliente is PJ and percentualRenda is 70', () => {
      expect(sut.decideContratacaoProduto(70, 'RF-03', 'PJ')).toBe(false);
    });
  });
});
