import { UUID } from '../../../shared/types/uuid.type';

export interface Category {
  id: UUID;
  description: string;
  image: string;
  isActive: boolean;
}
