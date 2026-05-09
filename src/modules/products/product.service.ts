import { productEsRepo } from "./product.es.repo.js";
import type { ProductEntity } from "./product.pg.repo.js";
import { productPgRepo } from "./product.pg.repo.js";

const makeId = (): string =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  sellerId: string;
}

export const productService = {
  createProduct(input: CreateProductInput): ProductEntity {
    const product: ProductEntity = {
      id: makeId(),
      name: input.name,
      description: input.description,
      price: input.price,
      sellerId: input.sellerId,
    };

    const created = productPgRepo.createProduct(product);
    productEsRepo.indexProduct(created);
    return created;
  },

  listProducts(): ProductEntity[] {
    return productPgRepo.listProducts();
  },

  searchProducts(query: string): ProductEntity[] {
    return productEsRepo.searchProducts(productPgRepo.listProducts(), query);
  },

  countProducts(): number {
    return productPgRepo.listProducts().length;
  },
};
