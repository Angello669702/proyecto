import { UUID } from '../../../shared/types/uuid.type';
import { Product } from '../../products/interfaces/product.interface';

export interface TransactionItem {
  id: UUID;
  product: Product;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}
