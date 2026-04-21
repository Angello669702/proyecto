import { Injectable } from '@angular/core';
import { CategoryDto } from '../dtos/category.dto';
import { Category } from '../interfaces/category.interface';

@Injectable({
  providedIn: 'root',
})
export class CategoryMapper {
  #map(category: CategoryDto): Category {
    return {
      description: category.description ?? '',
      image: category.image ?? '',
      isActive: category.is_active,
    };
  }

  map(categories: CategoryDto[]): Category[] {
    return categories.map((category) => this.#map(category));
  }
}
