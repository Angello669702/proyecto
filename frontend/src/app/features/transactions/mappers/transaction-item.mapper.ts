import { Injectable } from '@angular/core';
import { TransactionItemDto } from '../dtos/transaction-item.interface.dto';
import { TransactionItem } from '../interfaces/transaction-item.interface';
import { v4 as uuidv4 } from 'uuid';
@Injectable({
  providedIn: 'root',
})
export class TransactionItemMapper {
  mapOne(transaction: TransactionItemDto): TransactionItem {
    return {
      id: uuidv4(),
      product: transaction.product,
      quantity: transaction.quantity,
      unitPrice: transaction.quantity,
      subtotal: transaction.subtotal,
    };
  }

  mapList(transactions: TransactionItemDto[]): TransactionItem[] {
    return transactions.map((transaction) => this.mapOne(transaction));
  }
}
