import { Injectable } from '@angular/core';
import { PriceGroupItemDto } from '../dtos/price-group-item.dto.interface';
import { PriceGroupItem } from '../interfaces/price-group-item.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class PriceGroupItemMapper {
  mapOne(priceGroupItem: PriceGroupItemDto): PriceGroupItem {
    return { id: uuidv4(), ...priceGroupItem };
  }

  mapList(priceGroupItems: PriceGroupItemDto[]): PriceGroupItem[] {
    return priceGroupItems.map((priceGroupItem) => this.mapOne(priceGroupItem));
  }
}
