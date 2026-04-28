import { inject, Injectable, ResourceRef, Signal } from '@angular/core';

import { CommonCrudService } from '../../../shared/services/common-crud.service';
import { TransactionDto } from '../dtos/transaction.dto';
import { Transaction } from '../interfaces/transaction.interface';
import { TransactionMapper } from '../mappers/transaction.mapper';
import { rxResource } from '@angular/core/rxjs-interop';
import { NEVER, Observable, map, tap, catchError, throwError } from 'rxjs';
import { ProductService } from '../../products/services/product.service';
import { CartItem } from '../../../shared/interfaces/cart.interface';

@Injectable({ providedIn: 'root' })
export class TransactionService extends CommonCrudService<Transaction, TransactionDto> {
  readonly API_ENDPOINT = '';
  readonly mapper = inject(TransactionMapper);
  readonly #productService = inject(ProductService);
  readonly defaultModel = { id: '' } as Transaction;
  readonly defaultCartItem = { product: this.#productService.defaultModel, quantity: 0 };

  addItem(product: Signal<CartItem>): ResourceRef<Transaction | undefined> {
    return rxResource({
      params: () => product(),
      stream: ({ params: product }) =>
        this.#productService.isDefaultModel(product.product) ? NEVER : this.#addItem(product),
      equal: (transaction1, transaction2) => transaction1.id === transaction2.id,
    });
  }

  #addItem(product: CartItem): Observable<Transaction> {
    return this.httpClient.post<TransactionDto>(`${this.API_ENDPOINT}/addItem`, product).pipe(
      map((dto) => this.mapper.mapOne(dto)),
      tap((newproduct) =>
        this.modelsSignal.update((currentproducts) => [...currentproducts, newproduct]),
      ),
      catchError((error) => {
        console.error('Failed to add an model', error);
        return throwError(() => error);
      }),
    );
  }

  removeItem(product: Signal<CartItem>): ResourceRef<Transaction | undefined> {
    return rxResource({
      params: () => product(),
      stream: ({ params: product }) =>
        this.#productService.isDefaultModel(product.product) ? NEVER : this.#removeItem(product),
      equal: (transaction1, transaction2) => transaction1.id === transaction2.id,
    });
  }

  #removeItem(product: CartItem): Observable<Transaction> {
    return this.httpClient.post<TransactionDto>(`${this.API_ENDPOINT}/removeItem`, product).pipe(
      map((dto) => this.mapper.mapOne(dto)),
      tap((newproduct) =>
        this.modelsSignal.update((currentproducts) => [...currentproducts, newproduct]),
      ),
      catchError((error) => {
        console.error('Failed to add an model', error);
        return throwError(() => error);
      }),
    );
  }
}
