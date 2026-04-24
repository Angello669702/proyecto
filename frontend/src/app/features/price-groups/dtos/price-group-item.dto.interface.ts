import { Product } from '../../products/interfaces/product.interface';

export interface PriceGroupItemDto {
  product: Product;
  price: number;
}
