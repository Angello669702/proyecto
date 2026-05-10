import { UUID } from '../../../shared/types/uuid.type';
import { User } from '../../auth/interfaces/user.interface';

export interface ActionLog {
  id: UUID;
  action: string;
  description: string;
  user?: User;
  createdAt: Date;
}
