import { computed, inject, Injectable, ResourceRef, signal, Signal } from '@angular/core';

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
  readonly API_ENDPOINT = 'http://127.0.0.1:8000/api/transactions';
  readonly mapper = inject(TransactionMapper);
  readonly #productService = inject(ProductService);
  readonly defaultModel = { id: '' } as Transaction;
  readonly defaultCartItem = { product: this.#productService.defaultModel, quantity: 0 };
  #cart = signal<Transaction>(this.defaultModel);
  cart = computed(() => this.#cart());

  myCart(): ResourceRef<Transaction | undefined> {
    return rxResource({
      stream: () => this.#myCart(),
    });
  }

  #myCart(): Observable<Transaction> {
    return this.httpClient.get<{ data: TransactionDto }>(`${this.API_ENDPOINT}/cart`).pipe(
      tap((transaction) => console.log(transaction)),
      map(({ data }) => this.mapper.mapOne(data)),
      tap((transaction) => console.log(transaction)),
      tap((transaction) => this.#cart.set(transaction)),
      tap((transaction) => this.#updateTransactions(transaction)),
      catchError((error) => {
        console.error('Failed to add an model', error);
        return throwError(() => error);
      }),
    );
  }

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
      .post<{ data: TransactionDto }>(`${this.API_ENDPOINT}/add`, cartItem)
      .pipe(
        map(({ data }) => this.mapper.mapOne(data)),
        tap((transaction) => this.#updateTransactions(transaction)),
        tap((transaction) => this.#cart.set(transaction)),
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
      .post<{ data: TransactionDto }>(`${this.API_ENDPOINT}/remove`, cartItem)
      .pipe(
        map(({ data }) => this.mapper.mapOne(data)),
        tap((transaction) => this.#updateTransactions(transaction)),
        tap((transaction) => this.#cart.set(transaction)),
        catchError((error) => {
          console.error('Failed to add an model', error);
          return throwError(() => error);
        }),
      );
  }

  #updateTransactions(transaction: Transaction): void {
    this.modelsSignal.update((transactions) => {
      const exists = transactions.find((stored) => stored.id === transaction.id);
      if (!exists) return [...transactions, transaction];
      return transactions.map((stored) => (stored.id === transaction.id ? transaction : stored));
    });
  }
}
