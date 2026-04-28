import { UUID } from '../../../shared/types/uuid.type';
import { PriceGroupDto } from '../../price-groups/dtos/price-group.dto.interface';
import { ProductDto } from '../../products/dtos/product.interface.dto';
import { UserRole } from '../enums/user-role.enum';

export interface UserDto {
  id: UUID;
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
  price_group: PriceGroupDto;
  favourites: ProductDto[];
}
