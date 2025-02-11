import { database } from "../infrastructure/database";
import { Product } from "../models/product.model";

export class ProductRepository {
    private productDatabase;

    constructor() {
        this.productDatabase = database.products;
    }

    async getAll(): Promise<Product[]> {
        const snapshot = await this.productDatabase;
        return snapshot;
    }

    async getByName(name: string): Promise<Product | null> {
        const product = await this.productDatabase.find((product) => product.nome === name);
        return product ?? null
    }

    async getById(id: number): Promise<Product | null> {
        const product = await this.productDatabase.find((product) => product.id === id);
        return product ?? null
    }

}