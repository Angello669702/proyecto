import { Injectable } from '@angular/core';
import { RegistrationDto } from '../dtos/registration.interface.dto';
import { Registration } from '../interfaces/registration.interface';
import { v4 as uuidv4 } from 'uuid';
@Injectable({
  providedIn: 'root',
})
export class RegistrationMapper {
  mapOne(registration: RegistrationDto): Registration {
    return {
      id: uuidv4(),
      companyName: registration.company_name,
      nif: registration.nif,
      contactName: registration.contact_name,
      email: registration.email,
      phone: registration.phone,
      address: registration.address,
      notes: registration.notes ?? '',
      status: registration.status,
      reviewer: registration.reviewed_by,
      reviewedAt: registration.reviewed_at,
    };
  }

  mapList(registrations: RegistrationDto[]): Registration[] {
    return registrations.map((registration) => this.mapOne(registration));
  }
}
