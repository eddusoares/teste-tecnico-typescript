import { database } from "../infrastructure/database";
import { ProductModel } from "../models/product.model";

export class ProductRepository {
    private productDatabase;

    constructor() {
        this.productDatabase = database.products;
    }

    async getAll(): Promise<ProductModel[]> {
        const snapshot = await this.productDatabase;
        return snapshot;
    }

    async getByName(name: string): Promise<ProductModel | null> {
        const product = await this.productDatabase.find((product) => product.nome === name);
        return product ?? null
    }

}