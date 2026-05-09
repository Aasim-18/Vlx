export interface ProductEntity {
  id: string;
  name: string;
  description: string;
  price: number;
  sellerId: string;
}

const productStore: ProductEntity[] = [];

export const productPgRepo = {
  createProduct(product: ProductEntity): ProductEntity {
    productStore.push(product);
    return product;
  },
  listProducts(): ProductEntity[] {
    return productStore;
  },
};
