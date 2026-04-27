import { inject, Injectable } from '@angular/core';
import { Transaction } from '../interfaces/transaction.interface';
import { TransactionDto } from '../dtos/transaction.dto';
import { v4 as uuidv4 } from 'uuid';
import { TransactionItemMapper } from './transaction-item.mapper';
@Injectable({
  providedIn: 'root',
})
export class TransactionMapper {
  mapOne(transaction: TransactionDto): Transaction {
    return {
      id: uuidv4(),
      user: transaction.user,
      transactionsItems: inject(TransactionItemMapper).mapList(transaction.transactions_items),
      status: transaction.status,
      subtotal: transaction.subtotal,
      discountApplied: transaction.discount_applied,
      shippingCost: transaction.shipping_cost,
      total: transaction.total,
      shippingAddress: transaction.shipping_address,
      paymentIntentId: transaction.payment_intent_id ?? '',
      paymentStatus: transaction.payment_status,
      notes: transaction.notes ?? '',
    };
  }

  mapList(transactions: TransactionDto[]): Transaction[] {
    return transactions.map((transaction) => this.mapOne(transaction));
  }
}
