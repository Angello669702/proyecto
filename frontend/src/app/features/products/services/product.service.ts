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
  readonly API_ENDPOINT = 'http://51.91.110.54:8000/api/products';
  readonly mapper = inject(ProductMapper);
  readonly defaultModel = { id: '' } as Product;
  readonly defaultDto = { id: '' } as ProductDto;
  readonly defaultCartItem = { product: this.defaultModel, quantity: 0 };

  buildParams(filters: Signal<ProductFilter>): Signal<Record<string, string>> {
    return computed(() => {
      const filter = filters();
      const params: Record<string, string> = {};

      if (filter.searchText.trim()) params['search'] = filter.searchText.trim();
      if (filter.minPrice !== null) params['min_price'] = String(filter.minPrice);
      if (filter.maxPrice !== null) params['max_price'] = String(filter.maxPrice);
      if (filter.categories.length > 0) params['categories'] = filter.categories.join(',');
      if (filter.favouritesOnly) params['favourites_only'] = 'true';

      return params;
    });
  }

  loadFeatureProducts(): ResourceRef<Product[] | undefined> {
    return rxResource({
      stream: () => this.#loadFeatureProducts(),
    });
  }

  #loadFeatureProducts(): Observable<Product[] | undefined> {
    return this.httpClient.get<{ data: ProductDto[] }>(`${this.API_ENDPOINT}/featured`, {}).pipe(
      map((response) => this.mapper.mapList(response.data)),
      catchError((error) => {
        console.error('Failed to load models', error);
        return throwError(() => error);
      }),
    );
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

  favourite(product: Signal<Product>): ResourceRef<Product | undefined> {
    return rxResource({
      params: () => product(),
      stream: ({ params: product }) =>
        this.isDefaultModel(product) ? NEVER : this.#favourite(product),
      equal: (product1, product2) => product1.id === product2.id,
    });
  }

  #favourite(product: Product): Observable<Product> {
    return this.httpClient
      .post<{ data: ProductDto }>(`${this.API_ENDPOINT}/favourite`, { id: product.id })
      .pipe(
        map(({ data }) => this.mapper.mapOne(data)),
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
