import { computed, inject, Injectable, ResourceRef, Signal, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, NEVER, Observable, tap, throwError } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';
import { CategoryDto } from '../dtos/category.interface.dto';
import { Category } from '../interfaces/category.interface';
import { CategoryServiceAbstract } from './category.service.abstract';
import { CategoryMapper } from '../mappers/category.mapper';

@Injectable({ providedIn: 'root' })
export class CategoryService extends CategoryServiceAbstract {
  readonly #httpClient = inject(HttpClient);
  readonly #categoryMapper = inject(CategoryMapper);
  #categoriesSignal = signal<Category[]>([]);
  categorys = computed(() => this.#categoriesSignal());

  load(): ResourceRef<Category[] | undefined> {
    return rxResource({
      stream: () => this.#load(),
    });
  }

  #load(): Observable<Category[]> {
    return this.#httpClient.get<CategoryDto[]>(this.API_ENDPOINT).pipe(
      map((categorysDtos) => this.#categoryMapper.mapList(categorysDtos)),
      tap((categorys) => this.#categoriesSignal.set(categorys)),
      catchError((error) => {
        console.error('Failed to load categorys', error);
        return throwError(() => error);
      }),
    );
  }

  add(category: Signal<Category>): ResourceRef<Category | undefined> {
    return rxResource({
      params: () => category(),
      stream: ({ params: category }) =>
        this.isDefaultCategory(category) ? NEVER : this.#add(category),
      equal: (category1, category2) => category1.id === category2.id,
    });
  }

  #add(category: Category): Observable<Category> {
    return this.#httpClient.post<CategoryDto>(this.API_ENDPOINT, category).pipe(
      map((categoryDto) => this.#categoryMapper.mapOne(categoryDto)),
      tap((newCategory) =>
        this.#categoriesSignal.update((currentcategorys) => [...currentcategorys, newCategory]),
      ),
      catchError((error) => {
        console.error('Failed to add an category', error);
        return throwError(() => error);
      }),
    );
  }

  update(category: Signal<Category>): ResourceRef<Category | undefined> {
    return rxResource({
      params: () => category(),
      stream: ({ params: category }) =>
        this.isDefaultCategory(category) ? NEVER : this.#update(category),
      equal: (category1, category2) => category1.id === category2.id,
    });
  }

  #update(category: Category): Observable<Category> {
    return this.#httpClient.put<CategoryDto>(`${this.API_ENDPOINT}/${category.id}`, category).pipe(
      map((categoryDto) => this.#categoryMapper.mapOne(categoryDto)),
      tap((updatedcategory) =>
        this.#categoriesSignal.update((currentCategorys) =>
          currentCategorys.map((currentCategory) =>
            currentCategory.id === updatedcategory.id ? updatedcategory : currentCategory,
          ),
        ),
      ),
      catchError((error) => {
        console.error('Failed to update a category', error);
        return throwError(() => error);
      }),
    );
  }

  remove(category: Signal<Category>): ResourceRef<Category | undefined> {
    return rxResource({
      params: () => category(),
      stream: ({ params: category }) =>
        this.isDefaultCategory(category) ? NEVER : this.#remove(category),
      equal: (category1, category2) => category1.id === category2.id,
    });
  }

  #remove(category: Category): Observable<Category> {
    return this.#httpClient.delete<CategoryDto>(`${this.API_ENDPOINT}/${category.id}`).pipe(
      map((categoryDto) => this.#categoryMapper.mapOne(categoryDto)),
      tap(() =>
        this.#categoriesSignal.update((currentCategorys) =>
          currentCategorys.filter((currentCategory) => currentCategory.id !== category.id),
        ),
      ),
      catchError((error) => {
        console.error('Error deleting category', error);
        return throwError(() => error);
      }),
    );
  }

  find(id: Signal<number>): ResourceRef<Category | undefined> {
    return rxResource({
      params: () => id(),
      stream: ({ params: id }) => (id === 0 ? NEVER : this.#find(id)),
    });
  }

  #find(id: number): Observable<Category> {
    return this.#httpClient
      .get<CategoryDto>(`${this.API_ENDPOINT}/${id}`)
      .pipe(map((categoryDto) => this.#categoryMapper.mapOne(categoryDto)));
  }
}
