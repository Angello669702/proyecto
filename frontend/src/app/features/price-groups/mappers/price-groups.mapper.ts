import { inject, Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { PriceGroupDto } from '../dtos/price-group.dto.interface';
import { PriceGroup } from '../interfaces/price-group.interface';
import { PriceGroupItemMapper } from './price-group-item.mapper';
import { Mapper } from '../../../shared/interfaces/mapper.interface';

@Injectable({
  providedIn: 'root',
})
export class PriceGroupMapper implements Mapper<PriceGroup, PriceGroupDto> {
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
