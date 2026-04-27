import { inject, Injectable } from '@angular/core';
import { PriceGroupItemDto } from '../dtos/price-group-item.dto.interface';
import { PriceGroupItem } from '../interfaces/price-group-item.interface';
import { v4 as uuidv4 } from 'uuid';
import { PriceGroupDto } from '../dtos/price-group.dto.interface';
import { PriceGroup } from '../interfaces/price-group.interface';
import { PriceGroupItemMapper } from './price-group-item.mapper';

@Injectable({
  providedIn: 'root',
})
export class PriceGroupMapper {
  mapOne(priceGroup: PriceGroupDto): PriceGroup {
    return {
      id: uuidv4(),
      name: priceGroup.name,
      description: priceGroup.description,
      priceGroupItems: inject(PriceGroupItemMapper).mapList(priceGroup.price_group_items),
    };
  }

  mapList(priceGroups: PriceGroupDto[]): PriceGroup[] {
    return priceGroups.map((priceGroup) => this.mapOne(priceGroup));
  }
}
