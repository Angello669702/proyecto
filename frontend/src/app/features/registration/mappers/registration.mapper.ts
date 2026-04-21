import { Injectable } from '@angular/core';
import { RegistrationDto } from '../dtos/registration.dto';
import { Registration } from '../interfaces/registration.interface';

@Injectable({
  providedIn: 'root',
})
export class RegistrationMapper {
  #map(registration: RegistrationDto): Registration {
    return {
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

  map(registrations: RegistrationDto[]): Registration[] {
    return registrations.map((registration) => this.#map(registration));
  }
}
