import { inject, Injectable } from '@angular/core';
import { RegistrationDto } from '../dtos/registration.interface.dto';
import { Registration, RegistrationRequest } from '../interfaces/registration.interface';
import { v4 as uuidv4 } from 'uuid';
import { Mapper } from '../../../shared/interfaces/mapper.interface';
import { RegistrationStatus } from '../enums/registration-status.enum';
import { UserMapper } from '../../auth/mappers/user.mapper';
@Injectable({
  providedIn: 'root',
})
export class RegistrationMapper implements Mapper<Registration, RegistrationDto> {
  readonly #userMapper = inject(UserMapper);
  mapOne(registration: RegistrationDto): Registration {
    return {
      id: registration.id,
      companyName: registration.company_name,
      nif: registration.nif,
      contactName: registration.contact_name,
      email: registration.email,
      phone: registration.phone,
      address: registration.address,
      notes: registration.notes ?? '',
      status: registration.status,
      reviewer: registration.reviewed_by
        ? this.#userMapper.mapOne(registration.reviewed_by)
        : undefined,
      reviewedAt: registration.reviewed_at ?? undefined,
    };
  }

  mapList(registrations: RegistrationDto[]): Registration[] {
    return registrations.map((registration) => this.mapOne(registration));
  }

  toDto(registration: RegistrationRequest): RegistrationDto {
    return {
      id: uuidv4(),
      company_name: registration.companyName,
      nif: registration.nif,
      contact_name: registration.contactName,
      email: registration.email,
      phone: registration.phone,
      address: registration.address,
      notes: registration.notes,
      status: RegistrationStatus.PENDING,
    };
  }
}
