import { Injectable } from '@angular/core';
import { CategoryDto } from '../dtos/category.interface.dto';
import { Category } from '../interfaces/category.interface';
import { Mapper } from '../../../shared/interfaces/mapper.interface';
@Injectable({
  providedIn: 'root',
})
export class CategoryMapper implements Mapper<Category, CategoryDto> {
  mapOne(category: CategoryDto): Category {
    return {
      id: category.id,
      name: category.name,
      description: category.description ?? '',
      image: category.image ?? '',
      isActive: category.is_active,
    };
  }

  mapList(categories: CategoryDto[]): Category[] {
    return categories.map((category) => this.mapOne(category));
  }
}
