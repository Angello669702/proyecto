import { PriceGroupItemDto } from './price-group-item.dto.interface';

export interface PriceGroupDto {
  name: string;
  description: string;
  price_group_items: PriceGroupItemDto[];
}
