import { UUID } from '../../../shared/types/uuid.type';
import { UserRole } from '../enums/user-role.enum';

export interface User {
  id: UUID;
  name: string;
  email: string;
  password: string;
  companyName: string;
  nif: string;
  phone: string;
  address: string;
  profilePhoto: string;
  role: UserRole;
  isActive: boolean;
}
