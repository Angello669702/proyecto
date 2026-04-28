import { UUID } from '../../../shared/types/uuid.type';
import { Category } from '../../categories/interfaces/category.interface';

export interface ProductDto {
  id: UUID;
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
