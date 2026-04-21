import { Category } from '../../categories/interfaces/category.interface';

export interface ProductDto {
  category: Category;
  name: string;
  sku: string;
  description?: string;
  image?: string;
  price: number;
  stock: number;
  stock_alert_threshold: number;
  is_active: boolean;
}
