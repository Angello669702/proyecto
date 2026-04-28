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

  addItem(cartItem: Signal<CartItem>): ResourceRef<Transaction | undefined> {
    return rxResource({
      params: () => cartItem(),
      stream: ({ params: cartItem }) =>
        this.#productService.isDefaultModel(cartItem.product) ? NEVER : this.#addItem(cartItem),
      equal: (transaction1, transaction2) => transaction1.id === transaction2.id,
    });
  }

  #addItem(cartItem: CartItem): Observable<Transaction> {
    return this.httpClient
      .post<TransactionDto>(`${this.API_ENDPOINT}/addItem`, {
        product_id: cartItem.product.id,
        quantity: cartItem.quantity,
      })
      .pipe(
        map((dto) => this.mapper.mapOne(dto)),
        tap((transaction) => this.#updateActiveTransaction(transaction)),
        catchError((error) => {
          console.error('Failed to add an model', error);
          return throwError(() => error);
        }),
      );
  }

  removeItem(cartItem: Signal<CartItem>): ResourceRef<Transaction | undefined> {
    return rxResource({
      params: () => cartItem(),
      stream: ({ params: cartItem }) =>
        this.#productService.isDefaultModel(cartItem.product) ? NEVER : this.#removeItem(cartItem),
      equal: (transaction1, transaction2) => transaction1.id === transaction2.id,
    });
  }

  #removeItem(cartItem: CartItem): Observable<Transaction> {
    return this.httpClient
      .post<TransactionDto>(`${this.API_ENDPOINT}/removeItem`, {
        product_id: cartItem.product.id,
        quantity: cartItem.quantity,
      })
      .pipe(
        map((dto) => this.mapper.mapOne(dto)),
        tap((transaction) => this.#updateActiveTransaction(transaction)),
        catchError((error) => {
          console.error('Failed to add an model', error);
          return throwError(() => error);
        }),
      );
  }

  #updateActiveTransaction(transaction: Transaction): void {
    this.modelsSignal.update((transactions) => {
      const exists = transactions.find((stored) => stored.id === transaction.id);
      if (!exists) return [...transactions, transaction];
      return transactions.map((stored) => (stored.id === transaction.id ? transaction : stored));
    });
  }
}
