import { Product } from '../../features/products/interfaces/product.interface';

export interface CartItem {
  product: Product;
  quantity: number;
}
