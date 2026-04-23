import { UUID } from '../../../shared/types/uuid.type';
import { PriceGroupItem } from './price-group-item.interface';

export interface PriceGroup {
  id: UUID;
  name: string;
  description: string;
  priceGroupItems: PriceGroupItem[];
}
