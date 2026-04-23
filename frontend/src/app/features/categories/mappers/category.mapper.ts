import { Injectable } from '@angular/core';
import { CategoryDto } from '../dtos/category.interface.dto';
import { Category } from '../interfaces/category.interface';
import { v4 as uuidv4 } from 'uuid';
@Injectable({
  providedIn: 'root',
})
export class CategoryMapper {
  #map(category: CategoryDto): Category {
    return {
      id: uuidv4(),
      description: category.description ?? '',
      image: category.image ?? '',
      isActive: category.is_active,
    };
  }

  map(categories: CategoryDto[]): Category[] {
    return categories.map((category) => this.#map(category));
  }
}
