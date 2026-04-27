import { inject, ResourceRef, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface IMapper<TDto, TModel> {
  mapOne(dto: TDto): TModel;
  mapList(dtos: TDto[]): TModel[];
}

export abstract class CommonCrudServiceAbstract<TDto, TModel extends { id: string }> {
  abstract API_ENDPOINT: string;
  abstract defaultModel: TModel;
  abstract mapper: IMapper<TDto, TModel>;
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
