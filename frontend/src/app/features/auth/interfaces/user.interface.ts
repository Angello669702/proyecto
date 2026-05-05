import { UUID } from '../../../shared/types/uuid.type';
import { PriceGroup } from '../../price-groups/interfaces/price-group.interface';
import { Product } from '../../products/interfaces/product.interface';
import { Transaction } from '../../transactions/interfaces/transaction.interface';
import { UserRole } from '../enums/user-role.enum';

export interface User {
  id: UUID;
  name: string;
  fullName: string;
  email: string;
  password: string;
  companyName: string;
  nif: string;
  phone: string;
  address: string;
  profilePhoto: string;
  role: UserRole;
  isActive: boolean;
  favourites?: Product[];
}

export interface UserRequest {
  name: string;
  fullName: string;
  email: string;
  password: string;
  companyName: string;
  nif: string;
  phone: string;
  address: string;
  profilePhoto: string;
  role: UserRole;
}

export interface ChangePassword {
  currentPassword: string;
  newPassword: string;
}
