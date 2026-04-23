import { ResourceRef, Signal } from '@angular/core';
import { Category } from '../interfaces/category.interface';

export abstract class CategoryServiceAbstract {
  protected readonly API_ENDPOINT = 'http://localhost:8000/Categorys';

  readonly defaultCategory: Category = {
    id: '',
  } as Category;

  abstract load(): ResourceRef<Category[] | undefined>;
  abstract add(category: Signal<Category>): ResourceRef<Category | undefined>;
  abstract update(categoryToUpdate: Signal<Category>): ResourceRef<Category | undefined>;
  abstract remove(category: Signal<Category>): ResourceRef<Category | undefined>;
  abstract find(id: Signal<number>): ResourceRef<Category | undefined>;

  isDefaultCategory(category: Category): boolean {
    return category.id === this.defaultCategory.id;
  }
}
