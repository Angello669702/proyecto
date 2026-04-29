import { computed, inject, Injectable, ResourceRef, signal, Signal } from '@angular/core';

import { Product } from '../interfaces/product.interface';
import { ProductDto } from '../dtos/product.interface.dto';
import { ProductMapper } from '../mappers/product.mapper';
import { CommonCrudService } from '../../../shared/services/common-crud.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { NEVER, Observable, map, tap, catchError, throwError } from 'rxjs';
import { CartItem } from '../../../shared/interfaces/cart.interface';
import { ProductFilter } from '../interfaces/product-filter.interface';

@Injectable({ providedIn: 'root' })
export class ProductService extends CommonCrudService<Product, ProductDto> {
  readonly API_ENDPOINT = 'http://127.0.0.1:8000/api/products';
  readonly mapper = inject(ProductMapper);
  readonly defaultModel = { id: '' } as Product;
  readonly defaultCartItem = { product: this.defaultModel, quantity: 0 };

  buildFilters(filters: Signal<ProductFilter>): Signal<Record<string, string>> {
    return computed(() => {
      const filter = filters();
      console.log(filter);
      const params: Record<string, string> = {};

      if (filter.searchText.trim()) params['search'] = filter.searchText.trim();
      if (filter.minPrice !== null) params['min_price'] = String(filter.minPrice);
      if (filter.maxPrice !== null) params['max_price'] = String(filter.maxPrice);
      if (filter.categories.length > 0) params['categories'] = filter.categories.join(',');
      return params;
    });
  }

  updateStock(cartItem: Signal<CartItem>): ResourceRef<Product | undefined> {
    return rxResource({
      params: () => cartItem(),
      stream: ({ params: cartItem }) =>
        this.isDefaultModel(cartItem.product) ? NEVER : this.#updateStock(cartItem),
      equal: (product1, product2) => product1.id === product2.id,
    });
  }

  #updateStock(cartItem: CartItem): Observable<Product> {
    return this.httpClient
      .put<ProductDto>(`${this.API_ENDPOINT}/${cartItem.product.id}/stock`, {
        product_id: cartItem.product.id,
        quantity: cartItem.quantity,
      })
      .pipe(
        map((dto) => this.mapper.mapOne(dto)),
        tap((updatedProduct) =>
          this.modelsSignal.update((currentProducts) =>
            currentProducts.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)),
          ),
        ),
        catchError((error) => {
          console.error('Failed to add an model', error);
          return throwError(() => error);
        }),
      );
  }

  toggle(product: Signal<Product>): ResourceRef<Product | undefined> {
    return rxResource({
      params: () => product(),
      stream: ({ params: product }) =>
        this.isDefaultModel(product) ? NEVER : this.#toggle(product),
      equal: (product1, product2) => product1.id === product2.id,
    });
  }

  #toggle(product: Product): Observable<Product> {
    return this.httpClient
      .put<ProductDto>(`${this.API_ENDPOINT}/${product.id}/toggle`, product)
      .pipe(
        map((dto) => this.mapper.mapOne(dto)),
        tap((updatedProduct) =>
          this.modelsSignal.update((currentProducts) =>
            currentProducts.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)),
          ),
        ),
        catchError((error) => {
          console.error('Failed to add an model', error);
          return throwError(() => error);
        }),
      );
  }
}
