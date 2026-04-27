export interface Mapper<TModel, TDto> {
  mapOne: (dto: TDto) => TModel;
  mapList: (dtos: TDto[]) => TModel[];
}
