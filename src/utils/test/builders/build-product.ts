import { Product } from '../../../models/product.model';

export const buildProduct = (data?: Partial<Product>): Product => {
  const object: Product = {
    id: 0,
    nome: 'RF-01',
    valorAplicado: 0,
    taxaDeRetorno: 0,
    dataDeVencimento: new Date().toISOString(),
    tipoCliente: 'PF',
    ...data,
  };

  return new Product(object);
};
