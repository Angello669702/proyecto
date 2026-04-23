import { computed, inject, Injectable, ResourceRef, Signal, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, NEVER, Observable, tap, throwError } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductServiceAbstract } from './product.service.abstract';
import { Product } from '../interfaces/product.interface';
import { ProductDto } from '../dtos/product.interface.dto';
import { ProductMapper } from '../mappers/product.mapper';

@Injectable({ providedIn: 'root' })
export class ProductService extends ProductServiceAbstract {
  readonly #httpClient = inject(HttpClient);
  readonly #productMapper = inject(ProductMapper);
  #productsSignal = signal<Product[]>([]);
  products = computed(() => this.#productsSignal());

  load(): ResourceRef<Product[] | undefined> {
    return rxResource({
      stream: () => this.#load(),
    });
  }

  #load(): Observable<Product[]> {
    return this.#httpClient.get<ProductDto[]>(this.API_ENDPOINT).pipe(
      map((productsDtos) => this.#productMapper.mapList(productsDtos)),
      tap((products) => this.#productsSignal.set(products)),
      catchError((error) => {
        console.error('Failed to load products', error);
        return throwError(() => error);
      }),
    );
  }

  add(product: Signal<Product>): ResourceRef<Product | undefined> {
    return rxResource({
      params: () => product(),
      stream: ({ params: product }) =>
        this.isDefaultProduct(product) ? NEVER : this.#add(product),
      equal: (product1, product2) => product1.id === product2.id,
    });
  }

  #add(product: Product): Observable<Product> {
    return this.#httpClient.post<ProductDto>(this.API_ENDPOINT, product).pipe(
      map((productDto) => this.#productMapper.mapOne(productDto)),
      tap((newProduct) =>
        this.#productsSignal.update((currentProducts) => [...currentProducts, newProduct]),
      ),
      catchError((error) => {
        console.error('Failed to add an product', error);
        return throwError(() => error);
      }),
    );
  }

  update(product: Signal<Product>): ResourceRef<Product | undefined> {
    return rxResource({
      params: () => product(),
      stream: ({ params: product }) =>
        this.isDefaultProduct(product) ? NEVER : this.#update(product),
      equal: (product1, product2) => product1.id === product2.id,
    });
  }

  #update(product: Product): Observable<Product> {
    return this.#httpClient.put<ProductDto>(`${this.API_ENDPOINT}/${product.id}`, product).pipe(
      map((productDto) => this.#productMapper.mapOne(productDto)),
      tap((updatedProduct) =>
        this.#productsSignal.update((currentproducts) =>
          currentproducts.map((currentproduct) =>
            currentproduct.id === updatedProduct.id ? updatedProduct : currentproduct,
          ),
        ),
      ),
      catchError((error) => {
        console.error('Failed to update a product', error);
        return throwError(() => error);
      }),
    );
  }

  remove(product: Signal<Product>): ResourceRef<Product | undefined> {
    return rxResource({
      params: () => product(),
      stream: ({ params: product }) =>
        this.isDefaultProduct(product) ? NEVER : this.#remove(product),
      equal: (product1, product2) => product1.id === product2.id,
    });
  }

  #remove(product: Product): Observable<Product> {
    return this.#httpClient.delete<ProductDto>(`${this.API_ENDPOINT}/${product.id}`).pipe(
      map((productDto) => this.#productMapper.mapOne(productDto)),
      tap(() =>
        this.#productsSignal.update((currentProducts) =>
          currentProducts.filter((currentProduct) => currentProduct.id !== product.id),
        ),
      ),
      catchError((error) => {
        console.error('Error deleting product', error);
        return throwError(() => error);
      }),
    );
  }

  find(id: Signal<number>): ResourceRef<Product | undefined> {
    return rxResource({
      params: () => id(),
      stream: ({ params: id }) => (id === 0 ? NEVER : this.#find(id)),
    });
  }

  #find(id: number): Observable<Product> {
    return this.#httpClient
      .get<ProductDto>(`${this.API_ENDPOINT}/${id}`)
      .pipe(map((productDto) => this.#productMapper.mapOne(productDto)));
  }
}
