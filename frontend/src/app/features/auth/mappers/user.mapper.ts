import { inject, Injectable } from '@angular/core';
import { UserDto } from '../dtos/user.interface.dto';
import { User } from '../interfaces/user.interface';
import { PriceGroupMapper } from '../../price-groups/mappers/price-groups.mapper';
import { ProductMapper } from '../../products/mappers/product.mapper';
import { Mapper } from '../../../shared/interfaces/mapper.interface';
import { TransactionMapper } from '../../transactions/mappers/transaction.mapper';

@Injectable({
  providedIn: 'root',
})
export class UserMapper implements Mapper<User, UserDto> {
  readonly #priceGroupMapper = inject(PriceGroupMapper);
  readonly #productMapper = inject(ProductMapper);
  readonly #transactionMapper = inject(TransactionMapper);

  mapOne(user: UserDto): User {
    return {
      id: user.id,
      name: user.name,
      fullName: user.full_name,
      email: user.email,
      password: user.password,
      companyName: user.company_name,
      nif: user.nif,
      phone: user.phone,
      address: user.address,
      profilePhoto: user.profile_photo ?? '',
      role: user.role,
      isActive: user.is_active,
      priceGroup: user.price_group ? this.#priceGroupMapper.mapOne(user.price_group) : undefined,
      favourites: user.favourites ? this.#productMapper.mapList(user.favourites) : undefined,
      transaction: user.transaction ? this.#transactionMapper.mapOne(user.transaction) : undefined,
    };
  }

  mapList(users: UserDto[]): User[] {
    return users.map((user) => this.mapOne(user));
  }
}
