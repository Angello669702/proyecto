import { inject, Injectable } from '@angular/core';
import { UserDto } from '../dtos/user.interface.dto';
import { User } from '../interfaces/user.interface';
import { v4 as uuidv4 } from 'uuid';
import { PriceGroupMapper } from '../../price-groups/mappers/price-groups.mapper';
import { ProductMapper } from '../../products/mappers/product.mapper';

@Injectable({
  providedIn: 'root',
})
export class UserMapper {
  mapOne(user: UserDto): User {
    return {
      id: uuidv4(),
      name: user.name,
      email: user.email,
      password: user.password,
      companyName: user.company_name,
      nif: user.nif,
      phone: user.phone,
      address: user.address,
      profilePhoto: user.profile_photo ?? '',
      role: user.role,
      isActive: user.is_active,
      priceGroup: inject(PriceGroupMapper).mapOne(user.price_group),
      favourites: inject(ProductMapper).mapList(user.favourites),
    };
  }

  mapList(users: UserDto[]): User[] {
    return users.map((user) => this.mapOne(user));
  }
}
