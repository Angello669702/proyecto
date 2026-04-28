import { UUID } from '../../../shared/types/uuid.type';
import { User } from '../../auth/interfaces/user.interface';
import { RegistrationStatus } from '../enums/registration-status.enum';

export interface RegistrationDto {
  id: UUID;
  company_name: string;
  nif: string;
  contact_name: string;
  email: string;
  phone: string;
  address: string;
  notes?: string;
  status: RegistrationStatus;
  reviewed_by: User;
  reviewed_at: Date;
}
