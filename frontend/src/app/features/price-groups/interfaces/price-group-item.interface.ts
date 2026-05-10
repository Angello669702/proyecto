import { UUID } from '../../../shared/types/uuid.type';
import { Product } from '../../products/interfaces/product.interface';

export interface PriceGroupItem {
  id: UUID;
  product: Product;
  price: number;
  discountPercentage: number;
}
