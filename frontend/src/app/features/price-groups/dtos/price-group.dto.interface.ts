import { UUID } from '../../../shared/types/uuid.type';
import { PriceGroupItemDto } from './price-group-item.dto.interface';

export interface PriceGroupDto {
  id: UUID;
  name: string;
  description: string;
  price_group_items: PriceGroupItemDto[];
}
