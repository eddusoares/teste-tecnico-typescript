import { ProductModel } from "./product.model";

export type ClientModel = {
    id: number; 
    nome: string; 
    tipoCliente: string; 
    cpf: string; 
    cnpj: string; 
    endereço: string;
    rendaAnual: number; 
    faturamentoAnual: number;
    produtosContratados: ProductModel[]
}