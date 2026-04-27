import { inject, ResourceRef, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Mapper } from '../interfaces/mapper.interface';

export abstract class CommonCrudServiceAbstract<TModel extends { id: string }, TDto> {
  abstract API_ENDPOINT: string;
  abstract defaultModel: TModel;
  abstract mapper: Mapper<TModel, TDto>;
  protected httpClient = inject(HttpClient);

  abstract load(): ResourceRef<TModel[] | undefined>;
  abstract add(model: Signal<TModel>): ResourceRef<TModel | undefined>;
  abstract update(modelToUpdate: Signal<TModel>): ResourceRef<TModel | undefined>;
  abstract remove(model: Signal<TModel>): ResourceRef<TModel | undefined>;
  abstract find(id: Signal<number>): ResourceRef<TModel | undefined>;

  isDefaultModel(model: TModel): boolean {
    return model.id === this.defaultModel.id;
  }
}
