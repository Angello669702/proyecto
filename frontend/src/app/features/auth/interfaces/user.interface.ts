import { UUID } from '../../../shared/types/uuid.type';
import { PriceGroup } from '../../price-groups/interfaces/price-group.interface';
import { Product } from '../../products/interfaces/product.interface';
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
  priceGroup: PriceGroup;
  favourites: Product[];
}
