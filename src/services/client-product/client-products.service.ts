import { BadRequestError } from '../../errors/bad-request.error';
import { ValidationError } from '../../errors/validation.error';
import { Client } from '../../models/client.model';
import { Product } from '../../models/product.model';
import { ClientProductsRepository } from '../../repositories/client-products.repository';
import { ProductRepository } from '../../repositories/product.repository';
import { ClientService } from '../client/client.service';
import { ProductService } from '../product/product.service';

export class ClientProductsService {
  constructor(
    private readonly clientProductsRepository = new ClientProductsRepository(),
    private readonly productRepository = new ProductRepository(),
    private readonly clientService = new ClientService(),
    private readonly productService = new ProductService(),
  ) {}

  async gelAllClientProducts(clientId: number): Promise<Product[] | undefined> {
    await this.clientService.getClientById(clientId);

    return this.clientProductsRepository.getAll(clientId);
  }

  async create(product: Product, clientId: number): Promise<void> {
    const client = await this.clientService.getClientById(clientId);

    await this.productService.getByName(product.nome);

    if (!this.comparaTipoClienteTipoProduto(client.tipoCliente, product.nome)) {
      throw new ValidationError('Este produto não pode ser contratado para este tipo de Cliente!');
    }

    const aplicTotalClient = this.getValorTotalAplicadoPorCliente(client);
    const valorTotalClient = this.getRendaTotalCliente(client);
    const percentClient = this.getPercentualRenda(aplicTotalClient, valorTotalClient, product.valorAplicado);

    if (!this.decideContratacaoProduto(percentClient, product.nome, client.tipoCliente)) {
      throw new ValidationError(
        'Este cliente não pode contratar esse produto, o valor da aplicação passa do estipulado da renda total!',
      );
    }

    await this.clientProductsRepository.create(product, client.id);
  }

  async delete(input: { clientId: number; productId: number }): Promise<void> {
    const { clientId, productId } = input;

    const product = await this.productRepository.getById(productId);
    if (!product) {
      throw new BadRequestError('O Produto solicitado não existe!');
    }
    await this.clientProductsRepository.delete(clientId, productId);
  }

  getValorTotalAplicadoPorCliente(client: Client): number {
    const valorTotal = client.produtosContratados.reduce((acc, { valorAplicado }) => acc + valorAplicado, 0);
    return valorTotal;
  }

  getRendaTotalCliente(client: Client): number {
    return client.tipoCliente === 'PF' ? client.rendaAnual : client.faturamentoAnual;
  }

  comparaTipoClienteTipoProduto(tipoCliente: string, nomeProduto: string): boolean {
    switch (tipoCliente) {
      case 'PF':
        return nomeProduto === 'RF-01' || nomeProduto === 'RD-03';

      case 'PJ':
        return nomeProduto === 'RF-02' || nomeProduto === 'RD-03';
    }
    return false;
  }

  getPercentualRenda(valorTotal: number, rendaTotal: number, productValor: number): number {
    return ((valorTotal + productValor) / rendaTotal) * 100;
  }

  decideContratacaoProduto(percentualRenda: number, productName: string, tipoCliente: string): boolean {
    switch (productName) {
      case 'RF-01':
        return percentualRenda < 50;

      case 'RF-02':
        return percentualRenda < 70;

      case 'RF-03':
        if (tipoCliente === 'PF') {
          return percentualRenda < 50;
        }
        if (tipoCliente === 'PJ') {
          return percentualRenda < 70;
        }
        return false;
    }
    return false;
  }
}
