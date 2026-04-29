import { CategoryEnum } from '../enums/category.enum';

export interface ProductFilter {
  categories: CategoryEnum[];
  minPrice: number | null;
  maxPrice: number | null;
  searchText: string;
}
