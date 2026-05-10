import { UUID } from '../../../shared/types/uuid.type';
import { User } from '../../auth/interfaces/user.interface';
import { PriceGroupItem } from './price-group-item.interface';

export interface PriceGroup {
  id: UUID;
  name: string;
  description: string;
  itemsCount?: number;
  usersCount?: number;
  items?: PriceGroupItem[];
  users?: User[];
}
