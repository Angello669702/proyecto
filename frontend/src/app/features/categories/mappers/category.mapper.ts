import { Injectable } from '@angular/core';
import { CategoryDto } from '../dtos/category.interface.dto';
import { Category } from '../interfaces/category.interface';
import { v4 as uuidv4 } from 'uuid';
import { Mapper } from '../../../shared/interfaces/mapper.interface';
@Injectable({
  providedIn: 'root',
})
export class CategoryMapper implements Mapper<Category, CategoryDto> {
  mapOne(category: CategoryDto): Category {
    return {
      id: uuidv4(),
      description: category.description ?? '',
      image: category.image ?? '',
      isActive: category.is_active,
    };
  }

  mapList(categories: CategoryDto[]): Category[] {
    return categories.map((category) => this.mapOne(category));
  }
}
