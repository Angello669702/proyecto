import { UUID } from '../../../shared/types/uuid.type';
import { UserDto } from '../../auth/dtos/user.interface.dto';
import { PriceGroupItemDto } from './price-group-item.dto.interface';

export interface PriceGroupDto {
  id: UUID;
  name: string;
  description: string;
  items_count?: number;
  users_count?: number;
  items?: PriceGroupItemDto[];
  users?: UserDto[];
}
