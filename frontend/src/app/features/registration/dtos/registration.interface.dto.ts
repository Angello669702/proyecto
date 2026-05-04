import { UUID } from '../../../shared/types/uuid.type';
import { UserDto } from '../../auth/dtos/user.interface.dto';
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
  reviewed_by?: UserDto;
  reviewed_at?: Date;
}
