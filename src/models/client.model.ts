import { Joi } from "celebrate";
import { Product } from "./product.model";

export class Client  {
    id: number; 
    nome: string; 
    tipoCliente: string; 
    cpf: string; 
    cnpj: string; 
    endereco: string;
    rendaAnual: number; 
    faturamentoAnual: number;
    produtosContratados: Product[]

    constructor(data: Client | any ) {
        this.id = data.id;
        this.nome = data.nome;
        this.tipoCliente = data.tipoCliente;
        this.cpf = data.cpf;
        this.cnpj = data.cnpj;
        this.endereco = data.endereco;
        this.rendaAnual = data.rendaAnual;
        this.faturamentoAnual = data.faturamentoAnual;
        this.produtosContratados = data.produtosContratados;
    }
}

export const newClientSchema = Joi.object().keys({
    nome: Joi.string().trim().required(),
    tipoCliente: Joi.string().trim().required(),
    cpf: Joi.alternatives().conditional('tipoCliente', { not: 'PJ', then: Joi.string().required(), otherwise: Joi.any().allow(null) }),
    cnpj: Joi.alternatives().conditional('tipoCliente', { not: 'PF', then: Joi.string().required(), otherwise: Joi.any().allow(null) }),
    endereco: Joi.string().trim().required(),
    rendaAnual: Joi.alternatives().conditional('tipoCliente', { not: 'PJ', then: Joi.number().required(), otherwise: Joi.number() }),
    faturamentoAnual: Joi.alternatives().conditional('tipoCliente', { not: 'PF', then: Joi.number().required(), otherwise: Joi.number() }),
    produtosContratados: Joi.array().allow(null).required()
})

