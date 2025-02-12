import request from 'supertest';
import { Product } from '../../models/product.model';
import { ClientProductsService } from '../../services/client-product/client-products.service';
import { setupApp } from '../../setup-app';
import { buildProduct } from '../../utils/test/builders/build-product';

jest.mock('../../services/client-product/client-products.service');

const app = setupApp();

describe('ClientProductsController', () => {
  let mockGetAll: jest.Mock;
  let mockCreate: jest.Mock;
  let mockDelete: jest.Mock;

  beforeEach(() => {
    mockGetAll = ClientProductsService.prototype.gelAllClientProducts as jest.Mock;
    mockCreate = ClientProductsService.prototype.create as jest.Mock;
    mockDelete = ClientProductsService.prototype.delete as jest.Mock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get all products for a client', async () => {
    mockGetAll.mockResolvedValue([{ id: 1, name: 'Product 1' }]);

    const response = await request(app).get('/clients/1/products');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: 1, name: 'Product 1' }]);
    expect(mockGetAll).toHaveBeenCalledWith(1);
  });

  it('should create a new product for a client', async () => {
    const newProduct = buildProduct({ nome: 'New Product' });
    mockCreate.mockResolvedValue({ id: 2, nome: 'New Product' });

    const response = await request(app)
      .post('/clients/1/products')
      .send({ ...newProduct, id: undefined, tipoCliente: undefined } as Partial<Product>);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: 'Produto cadastrado com sucesso!',
    });
    expect(mockCreate).toHaveBeenCalledWith(
      { ...newProduct, id: undefined, tipoCliente: undefined } as Partial<Product>,
      1,
    );
  });

  it('should delete a product for a client', async () => {
    mockDelete.mockResolvedValue(undefined);

    const response = await request(app).delete('/clients/1/products/1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'Produto excluído com sucesso!',
    });
    expect(mockDelete).toHaveBeenCalledWith({ clientId: 1, productId: 1 });
  });
});
