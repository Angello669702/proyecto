import { UserRole } from '../enums/user-role.enum';

export interface UserDto {
  name: string;
  email: string;
  password: string;
  company_name: string;
  nif: string;
  phone: string;
  address: string;
  profile_photo?: string;
  role: UserRole;
  is_active: boolean;
}
