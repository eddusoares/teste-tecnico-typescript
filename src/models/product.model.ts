import { Joi } from 'celebrate';

export class Product {
  id: number;
  nome: string;
  valorAplicado: number;
  taxaDeRetorno: number;
  dataDeVencimento: string;
  tipoCliente: string;

  constructor(data: Product | any) {
    this.id = data.id;
    this.nome = data.nome;
    this.valorAplicado = data.valorAplicado;
    this.taxaDeRetorno = data.taxaDeRetorno;
    this.dataDeVencimento = data.dataDeVencimento;
    this.tipoCliente = data.tipoCliente;
  }
}
export const updateProductSchema = Joi.object().keys({
  nome: Joi.string().trim().required(),
  valorAplicado: Joi.number().required(),
  taxaDeRetorno: Joi.number().required(),
  dataDeVencimento: Joi.string().isoDate().required(),
});
