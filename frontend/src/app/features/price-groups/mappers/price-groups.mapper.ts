import { inject, Injectable } from '@angular/core';
import { PriceGroupDto } from '../dtos/price-group.dto.interface';
import { PriceGroup } from '../interfaces/price-group.interface';
import { PriceGroupItemMapper } from './price-group-item.mapper';
import { Mapper } from '../../../shared/interfaces/mapper.interface';
import { UserMapper } from '../../auth/mappers/user.mapper';

@Injectable({
  providedIn: 'root',
})
export class PriceGroupMapper implements Mapper<PriceGroup, PriceGroupDto> {
  readonly #priceGroupItemMapper = inject(PriceGroupItemMapper);
  mapOne(priceGroup: PriceGroupDto): PriceGroup {
    return {
      id: priceGroup.id,
      name: priceGroup.name,
      description: priceGroup.description,
      items: priceGroup.items ? this.#priceGroupItemMapper.mapList(priceGroup.items) : undefined,
      users: priceGroup.users?.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        isActive: u.is_active,
        fullName: u.full_name,
        companyName: u.company_name,
        nif: u.nif,
        phone: u.phone,
        address: u.address,
        profilePhoto: u.profile_photo ?? '',
        password: '',
        priceGroup: undefined,
        favourites: undefined,
      })),
      itemsCount: priceGroup.items_count ?? undefined,
      usersCount: priceGroup.users_count ?? undefined,
    };
  }

  mapList(priceGroups: PriceGroupDto[]): PriceGroup[] {
    return priceGroups.map((priceGroup) => this.mapOne(priceGroup));
  }

  toDto(priceGroup: PriceGroup): PriceGroupDto {
    return {
      id: priceGroup.id,
      name: priceGroup.name,
      description: priceGroup.description,
      items: priceGroup.items
        ? priceGroup.items.map((item) => this.#priceGroupItemMapper.toDto(item))
        : undefined,
      items_count: priceGroup.itemsCount,
      users_count: priceGroup.usersCount,
    };
  }
}
