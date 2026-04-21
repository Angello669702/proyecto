import { Product } from '../../products/interfaces/product.interface';

export interface TransactionItem {
  product: Product;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}
