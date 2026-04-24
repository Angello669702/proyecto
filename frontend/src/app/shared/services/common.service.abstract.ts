import { inject, ResourceRef, Signal } from '@angular/core';
import { Feature, Mapper } from '../types/features.type';
import { HttpClient } from '@angular/common/http';

export abstract class CommonServiceAbstract {
  abstract API_ENDPOINT: string;
  abstract defaultFeature: Feature;
  abstract mapper: Mapper;
  protected httpClient = inject(HttpClient);

  abstract load(): ResourceRef<Feature[] | undefined>;
  abstract add(feature: Signal<Feature>): ResourceRef<Feature | undefined>;
  abstract update(featureToUpdate: Signal<Feature>): ResourceRef<Feature | undefined>;
  abstract remove(feature: Signal<Feature>): ResourceRef<Feature | undefined>;
  abstract find(id: Signal<number>): ResourceRef<Feature | undefined>;

  isDefaultFeature(feature: Feature): boolean {
    return feature.id === this.defaultFeature.id;
  }
}
