import { computed, Injectable, ResourceRef, Signal, signal } from '@angular/core';
import { catchError, map, NEVER, Observable, tap, throwError } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';
import { CommonCrudServiceAbstract } from './common-crud.service.abstract';
import { PaginatedResponse } from '../interfaces/paginated.interface';

@Injectable({ providedIn: 'root' })
export abstract class CommonCrudService<
  TModel extends { id: string },
  TDto,
> extends CommonCrudServiceAbstract<TModel, TDto> {
  protected modelsSignal = signal<TModel[]>([]);
  models = computed(() => this.modelsSignal());
  #lastPage = signal<number>(0);
  lastPage = computed(() => this.#lastPage());

  load(
    page: Signal<number>,
    params?: Signal<Record<string, string>>,
  ): ResourceRef<TModel[] | undefined> {
    return rxResource({
      params: () => ({ page: page(), extra: params?.() ?? {} }),
      stream: ({ params }) => this.#load(params.page, params.extra),
    });
  }

  #load(page: number, params: Record<string, string>): Observable<TModel[]> {
    console.log(params);
    return this.httpClient
      .get<PaginatedResponse<TDto[]>>(this.API_ENDPOINT, {
        params: {
          page,
          ...params,
        },
      })
      .pipe(
        tap((response) => this.#lastPage.set(response.meta.last_page)),
        map((response) => this.mapper.mapList(response.data)),
        tap((models) => this.modelsSignal.set(models)),
        catchError((error) => {
          console.error('Failed to load models', error);
          return throwError(() => error);
        }),
      );
  }

  add(model: Signal<TModel>): ResourceRef<TModel | undefined> {
    return rxResource({
      params: () => model(),
      stream: ({ params: model }) => (this.isDefaultModel(model) ? NEVER : this.#add(model)),
      equal: (model1, model2) => model1.id === model2.id,
    });
  }

  #add(model: TModel): Observable<TModel> {
    return this.httpClient.post<TDto>(this.API_ENDPOINT, model).pipe(
      map((dto) => this.mapper.mapOne(dto)),
      tap((newModel) => this.modelsSignal.update((currentModels) => [...currentModels, newModel])),
      catchError((error) => {
        console.error('Failed to add an model', error);
        return throwError(() => error);
      }),
    );
  }

  update(model: Signal<TModel>): ResourceRef<TModel | undefined> {
    return rxResource({
      params: () => model(),
      stream: ({ params: model }) => (this.isDefaultModel(model) ? NEVER : this.#update(model)),
      equal: (model1, model2) => model1.id === model2.id,
    });
  }

  #update(model: TModel): Observable<TModel> {
    return this.httpClient.put<TDto>(`${this.API_ENDPOINT}/${model.id}`, model).pipe(
      map((dto) => this.mapper.mapOne(dto)),
      tap((updatedModel) =>
        this.modelsSignal.update((currentModels) =>
          currentModels.map((currentModel) =>
            currentModel.id === updatedModel.id ? updatedModel : currentModel,
          ),
        ),
      ),
      catchError((error) => {
        console.error('Failed to update a model', error);
        return throwError(() => error);
      }),
    );
  }

  remove(model: Signal<TModel>): ResourceRef<TModel | undefined> {
    return rxResource({
      params: () => model(),
      stream: ({ params: model }) => (this.isDefaultModel(model) ? NEVER : this.#remove(model)),
      equal: (model1, model2) => model1.id === model2.id,
    });
  }

  #remove(model: TModel): Observable<TModel> {
    return this.httpClient.delete<TDto>(`${this.API_ENDPOINT}/${model.id}`).pipe(
      map((dto) => this.mapper.mapOne(dto)),
      tap(() =>
        this.modelsSignal.update((currentModels) =>
          currentModels.filter((currentModel) => currentModel.id !== model.id),
        ),
      ),
      catchError((error) => {
        console.error('Error deleting model', error);
        return throwError(() => error);
      }),
    );
  }

  find(id: Signal<string>): ResourceRef<TModel | undefined> {
    return rxResource({
      params: () => id(),
      stream: ({ params: id }) => (id === '' ? NEVER : this.findOne(id)),
    });
  }

  findOne(id: string): Observable<TModel> {
    return this.httpClient.get<{ data: TDto }>(`${this.API_ENDPOINT}/${id}`).pipe(
      map((response) => {
        return this.mapper.mapOne(response.data);
      }),
    );
  }
}
