import { Client } from '../models/client.model';
import { Product } from '../models/product.model';

export const database: { clients: Client[]; products: Product[] } = {
  clients: [
    {
      id: 1,
      nome: 'Eduardo Soares',
      tipoCliente: 'PF',
      cpf: '883.551.193-39',
      cnpj: '',
      endereco: 'Rua 13',
      rendaAnual: 100000.0,
      faturamentoAnual: 0,
      produtosContratados: [
        {
          id: 1,
          nome: 'RF-01',
          valorAplicado: 150.0,
          taxaDeRetorno: 9.03,
          dataDeVencimento: '10032026',
          tipoCliente: 'PF',
        },
        { id: 3, nome: 'RF-03', valorAplicado: 3280.0, taxaDeRetorno: 7.24, dataDeVencimento: '', tipoCliente: 'TDS' },
      ],
    },
    {
      id: 2,
      nome: 'José Transportes',
      tipoCliente: 'PJ',
      cpf: '',
      cnpj: '44.672.475/0001-08',
      endereco: 'Rua 10',
      rendaAnual: 0,
      faturamentoAnual: 100000.0,
      produtosContratados: [
        {
          id: 1,
          nome: 'RF-01',
          valorAplicado: 150.0,
          taxaDeRetorno: 9.03,
          dataDeVencimento: '10032026',
          tipoCliente: 'PF',
        },
        { id: 3, nome: 'RF-03', valorAplicado: 3280.0, taxaDeRetorno: 7.24, dataDeVencimento: '', tipoCliente: 'TDS' },
      ],
    },
    {
      id: 3,
      nome: 'Maria Silva',
      tipoCliente: 'PF',
      cpf: '816.317.651-24',
      cnpj: '',
      endereco: 'Rua 11',
      rendaAnual: 100000.0,
      faturamentoAnual: 0,
      produtosContratados: [
        {
          id: 1,
          nome: 'RF-01',
          valorAplicado: 60000.5,
          taxaDeRetorno: 9.03,
          dataDeVencimento: '10032026',
          tipoCliente: 'PF',
        },
        { id: 3, nome: 'RF-03', valorAplicado: 22000.7, taxaDeRetorno: 7.24, dataDeVencimento: '', tipoCliente: 'TDS' },
      ],
    },
  ],
  products: [
    { id: 1, nome: 'RF-01', valorAplicado: 0, taxaDeRetorno: 9.03, dataDeVencimento: '', tipoCliente: 'PF' },
    { id: 2, nome: 'RF-02', valorAplicado: 0, taxaDeRetorno: 11.09, dataDeVencimento: '', tipoCliente: 'PJ' },
    { id: 3, nome: 'RF-03', valorAplicado: 0, taxaDeRetorno: 7.24, dataDeVencimento: '', tipoCliente: 'TDS' },
  ],
};
