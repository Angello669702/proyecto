import { UUID } from '../../../shared/types/uuid.type';
import { Product } from '../../products/interfaces/product.interface';

export interface TransactionItem {
  id: UUID;
  product: Product;
  quantity: number;
  originalPrice: number;
  unitPrice: number;
  discount: number;
  vatRate: number;
  vatAmount: number;
  subtotal: number;
  subtotalWithVat: number;
}
