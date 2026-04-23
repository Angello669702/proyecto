import { Product } from '../../products/interfaces/product.interface';
import { PriceGroup } from './price-group.interface';

export interface PriceGroupItem {
  product: Product;
  price: number;
}
