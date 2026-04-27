import { inject, Injectable } from '@angular/core';

import { CommonCrudService } from '../../../shared/services/common-crud.service';
import { RegistrationDto } from '../dtos/registration.interface.dto';
import { Registration } from '../interfaces/registration.interface';
import { RegistrationMapper } from '../mappers/registration.mapper';

@Injectable({ providedIn: 'root' })
export class RegistrationService extends CommonCrudService<Registration, RegistrationDto> {
  readonly API_ENDPOINT = '';
  readonly mapper = inject(RegistrationMapper);
  readonly defaultModel = { id: '' } as Registration;
}
