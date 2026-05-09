import type { ProductEntity } from "./product.pg.repo.js";

export const productEsRepo = {
  indexProduct(_product: ProductEntity): void {
    // Elasticsearch indexing hook.
  },
  searchProducts(products: ProductEntity[], query: string): ProductEntity[] {
    if (!query) return products;
    const term = query.toLowerCase();
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term)
    );
  },
};
