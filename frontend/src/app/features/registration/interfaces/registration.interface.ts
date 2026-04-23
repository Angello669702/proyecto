import { UUID } from '../../../shared/types/uuid.type';
import { User } from '../../auth/interfaces/user.interface';
import { RegistrationStatus } from '../enums/registration-status.enum';

export interface Registration {
  id: UUID;
  companyName: string;
  nif: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
  status: RegistrationStatus;
  reviewer: User;
  reviewedAt: Date;
}
