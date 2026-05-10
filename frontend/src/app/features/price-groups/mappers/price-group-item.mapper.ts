import { Injectable } from '@angular/core';
import { PriceGroupItemDto } from '../dtos/price-group-item.dto.interface';
import { PriceGroupItem } from '../interfaces/price-group-item.interface';
import { Mapper } from '../../../shared/interfaces/mapper.interface';

@Injectable({
  providedIn: 'root',
})
export class PriceGroupItemMapper implements Mapper<PriceGroupItem, PriceGroupItemDto> {
  mapOne(priceGroupItem: PriceGroupItemDto): PriceGroupItem {
    return { ...priceGroupItem, discountPercentage: priceGroupItem.discount_percentage };
  }

  mapList(priceGroupItems: PriceGroupItemDto[]): PriceGroupItem[] {
    return priceGroupItems.map((priceGroupItem) => this.mapOne(priceGroupItem));
  }

  toDto(priceGroupItem: PriceGroupItem): PriceGroupItemDto {
    return { ...priceGroupItem, discount_percentage: priceGroupItem.discountPercentage };
  }
}
