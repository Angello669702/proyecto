import { inject, ResourceRef, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Mapper } from '../interfaces/mapper.interface';
import { UUID } from '../types/uuid.type';

export abstract class CommonCrudServiceAbstract<TModel extends { id: string }, TDto> {
  abstract API_ENDPOINT: string;
  abstract defaultModel: TModel;
  abstract mapper: Mapper<TModel, TDto>;
  protected httpClient = inject(HttpClient);

  abstract loadPaginated(page: Signal<number>): ResourceRef<TModel[] | undefined>;
  abstract load(): ResourceRef<TModel[] | undefined>;
  abstract add(model: Signal<TModel>): ResourceRef<TModel | undefined>;
  abstract update(model: Signal<TModel>, id: UUID): ResourceRef<TModel | undefined>;
  abstract remove(model: Signal<TModel>): ResourceRef<TModel | undefined>;
  abstract find(id: Signal<string>): ResourceRef<TModel | undefined>;

  isDefaultModel(model: TModel): boolean {
    return model.id === this.defaultModel.id;
  }
}
