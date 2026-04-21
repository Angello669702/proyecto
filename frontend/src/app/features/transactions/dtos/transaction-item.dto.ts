import { Product } from '../../products/interfaces/product.interface';

export interface TransactionItemDto {
  product: Product;
  quantity: number;
  unit_price: number;
  subtotal: number;
}
