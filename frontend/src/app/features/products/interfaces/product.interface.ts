import { UUID } from '../../../shared/types/uuid.type';
import { Category } from '../../categories/interfaces/category.interface';

export interface Product {
  id: UUID;
  category: Category;
  name: string;
  sku: string;
  description: string;
  image: string[];
  price: number;
  stock: number;
  stockAlertThreshold: number;
  isActive: boolean;
}
