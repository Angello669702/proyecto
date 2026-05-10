import { UUID } from '../../../shared/types/uuid.type';
import { UserDto } from '../../auth/dtos/user.interface.dto';

export interface ActionLogDto {
  id: UUID;
  action: string;
  description: string;
  user?: UserDto;
  created_at: string;
}
