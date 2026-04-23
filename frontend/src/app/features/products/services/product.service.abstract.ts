import { ResourceRef, Signal } from '@angular/core';
import { Product } from '../interfaces/product.interface';

export abstract class ProductServiceAbstract {
  protected readonly API_ENDPOINT = 'http://localhost:8000/Products';

  readonly defaultProduct: Product = {
    id: '',
  } as Product;

  abstract load(): ResourceRef<Product[] | undefined>;
  abstract add(product: Signal<Product>): ResourceRef<Product | undefined>;
  abstract update(productToUpdate: Signal<Product>): ResourceRef<Product | undefined>;
  abstract remove(product: Signal<Product>): ResourceRef<Product | undefined>;
  abstract find(id: Signal<number>): ResourceRef<Product | undefined>;

  isDefaultProduct(product: Product): boolean {
    return product.id === this.defaultProduct.id;
  }
}
