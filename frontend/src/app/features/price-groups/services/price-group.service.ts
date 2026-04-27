import { inject, Injectable } from '@angular/core';

import { CommonCrudService } from '../../../shared/services/common-crud.service';
import { PriceGroupDto } from '../dtos/price-group.dto.interface';
import { PriceGroup } from '../interfaces/price-group.interface';
import { PriceGroupMapper } from '../mappers/price-groups.mapper';

@Injectable({ providedIn: 'root' })
export class PriceGroupService extends CommonCrudService<PriceGroup, PriceGroupDto> {
  readonly API_ENDPOINT = '';
  readonly mapper = inject(PriceGroupMapper);
  readonly defaultModel = { id: '' } as PriceGroup;
}
