import { Client } from '../../../models/client.model';

export const buildClient = (data: Partial<Client>): Client => {
  const object = {
    id: 0,
    nome: '',
    tipoCliente: 'PF',
    cpf: '12345678901',
    cnpj: '12345678941236',
    endereco: 'Rua Dezenove',
    rendaAnual: 0,
    faturamentoAnual: 0,
    produtosContratados: [],
    ...data,
  };
  return new Client(object);
};
