import { UUID } from '../../../shared/types/uuid.type';

export interface Category {
  id: UUID;
  name: string;
  description: string;
  image: string;
  isActive: boolean;
}
