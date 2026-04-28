import { UUID } from '../../../shared/types/uuid.type';

export interface CategoryDto {
  id: UUID;
  name: string;
  description?: string;
  image?: string;
  is_active: boolean;
}
