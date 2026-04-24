import { UUID } from '../../../shared/types/uuid.type';
import { PriceGroupItem } from '../interfaces/price-group-item.interface';

export interface PriceGroupDto {
  name: string;
  description: string;
  price_group_items: PriceGroupItem[];
}
