import { inject, Injectable } from '@angular/core';
import { Transaction } from '../interfaces/transaction.interface';
import { TransactionDto } from '../dtos/transaction.dto';
import { v4 as uuidv4 } from 'uuid';
import { TransactionItemMapper } from './transaction-item.mapper';
import { Mapper } from '../../../shared/interfaces/mapper.interface';
@Injectable({
  providedIn: 'root',
})
export class TransactionMapper implements Mapper<Transaction, TransactionDto> {
  readonly #transactionItemMapper = inject(TransactionItemMapper);
  mapOne(transaction: TransactionDto): Transaction {
    return {
      id: transaction.id,
      user: transaction.user,
      transactionsItems: this.#transactionItemMapper.mapList(transaction.transactions_items ?? []),
      status: transaction.status,
      subtotal: transaction.subtotal,
      discountApplied: transaction.discount_applied,
      vatTotal: transaction.vat_total,
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

  toDto(transaction: Transaction): TransactionDto {
    return {
      id: transaction.id,
      user: transaction.user,
      transactions_items: transaction.transactionsItems.map((item) =>
        this.#transactionItemMapper.toDto(item),
      ),
      status: transaction.status,
      subtotal: transaction.subtotal,
      discount_applied: transaction.discountApplied,
      vat_total: transaction.vatTotal,
      shipping_cost: transaction.shippingCost,
      total: transaction.total,
      shipping_address: transaction.shippingAddress,
      payment_intent_id: transaction.paymentIntentId,
      payment_status: transaction.paymentStatus,
      notes: transaction.notes,
    };
  }
}
