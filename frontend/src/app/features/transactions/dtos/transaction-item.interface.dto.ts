import { UUID } from '../../../shared/types/uuid.type';
import { Product } from '../../products/interfaces/product.interface';

export interface TransactionItemDto {
  id: UUID;
  product: Product;
  quantity: number;
  unit_price: number;
  subtotal: number;
}
