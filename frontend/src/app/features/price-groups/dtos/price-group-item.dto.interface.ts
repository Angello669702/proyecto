import { UUID } from '../../../shared/types/uuid.type';
import { Product } from '../../products/interfaces/product.interface';

export interface PriceGroupItemDto {
  id: UUID;
  product: Product;
  price: number;
}
