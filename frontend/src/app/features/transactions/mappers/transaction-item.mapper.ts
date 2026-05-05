import { inject, Injectable } from '@angular/core';
import { TransactionItemDto } from '../dtos/transaction-item.interface.dto';
import { TransactionItem } from '../interfaces/transaction-item.interface';
import { Mapper } from '../../../shared/interfaces/mapper.interface';
import { ProductMapper } from '../../products/mappers/product.mapper';
@Injectable({
  providedIn: 'root',
})
export class TransactionItemMapper implements Mapper<TransactionItem, TransactionItemDto> {
  readonly #productMapper = inject(ProductMapper);
  mapOne(transaction: TransactionItemDto): TransactionItem {
    return {
      id: transaction.id,
      product: this.#productMapper.mapOne(transaction.product),
      quantity: transaction.quantity,
      originalPrice: transaction.original_price,
      unitPrice: transaction.unit_price,
      discount: transaction.discount,
      vatRate: transaction.vat_rate,
      vatAmount: transaction.vat_amount,
      subtotal: transaction.subtotal,
      subtotalWithVat: transaction.subtotal_with_vat,
    };
  }

  mapList(transactions: TransactionItemDto[]): TransactionItem[] {
    return transactions.map((transaction) => this.mapOne(transaction));
  }

  toDto(item: TransactionItem): TransactionItemDto {
    return {
      id: item.id,
      product: this.#productMapper.toDto(item.product),
      quantity: item.quantity,
      original_price: item.originalPrice,
      unit_price: item.unitPrice,
      discount: item.discount,
      vat_rate: item.vatRate,
      vat_amount: item.vatAmount,
      subtotal: item.subtotal,
      subtotal_with_vat: item.subtotalWithVat,
    };
  }
}
