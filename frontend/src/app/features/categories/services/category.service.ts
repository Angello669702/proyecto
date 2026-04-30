import { inject, Injectable } from '@angular/core';
import { CommonCrudService } from '../../../shared/services/common-crud.service';
import { CategoryMapper } from '../mappers/category.mapper';
import { CategoryDto } from '../dtos/category.interface.dto';
import { Category } from '../interfaces/category.interface';

@Injectable({ providedIn: 'root' })
export class CategoryService extends CommonCrudService<Category, CategoryDto> {
  readonly API_ENDPOINT = 'http://127.0.0.1:8000/api/categories';
  readonly mapper = inject(CategoryMapper);
  readonly defaultModel = { id: '' } as Category;
}
