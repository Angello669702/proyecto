import { Injectable } from '@angular/core';
import { TransactionItemDto } from '../dtos/transaction-item.dto';
import { TransactionItem } from '../interface/transaction-item.interface';

@Injectable({
  providedIn: 'root',
})
export class TransactionItemMapper {
  #map(transaction: TransactionItemDto): TransactionItem {
    return {
      product: transaction.product,
      quantity: transaction.quantity,
      unitPrice: transaction.quantity,
      subtotal: transaction.subtotal,
    };
  }

  map(transactions: TransactionItemDto[]): TransactionItem[] {
    return transactions.map((transaction) => this.#map(transaction));
  }
}
