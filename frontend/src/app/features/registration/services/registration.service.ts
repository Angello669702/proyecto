import { computed, inject, Injectable, ResourceRef, Signal } from '@angular/core';

import { CommonCrudService } from '../../../shared/services/common-crud.service';
import { RegistrationDto } from '../dtos/registration.interface.dto';
import { Registration } from '../interfaces/registration.interface';
import { RegistrationMapper } from '../mappers/registration.mapper';
import { RegistrationStatus } from '../enums/registration-status.enum';
import { rxResource } from '@angular/core/rxjs-interop';
import { NEVER, Observable, map, tap, catchError, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RegistrationService extends CommonCrudService<Registration, RegistrationDto> {
  readonly API_ENDPOINT = 'http://127.0.0.1:8000/api/registrations';
  readonly mapper = inject(RegistrationMapper);
  readonly defaultModel = { id: '' } as Registration;
  readonly defaultDto = { id: '' } as RegistrationDto;

  buildParams(filter: Signal<RegistrationStatus | 'all'>): Signal<Record<string, string>> {
    return computed(() => ({ status: filter() }));
  }

  approve(registration: Signal<Registration>): ResourceRef<Registration | undefined> {
    return rxResource({
      params: () => registration(),
      stream: ({ params: registration }) =>
        this.isDefaultModel(registration) ? NEVER : this.#approve(registration),
      equal: (registration1, registration2) => registration1.id === registration2.id,
    });
  }

  #approve(registration: Registration): Observable<Registration> {
    return this.httpClient
      .put<RegistrationDto>(`${this.API_ENDPOINT}/${registration.id}/approve`, registration)
      .pipe(
        map((dto) => this.mapper.mapOne(dto)),
        tap((registration) => this.#updateRegistration(registration)),
        catchError((error) => {
          console.error('Failed to approve an registration', error);
          return throwError(() => error);
        }),
      );
  }

  reject(registration: Signal<Registration>): ResourceRef<Registration | undefined> {
    return rxResource({
      params: () => registration(),
      stream: ({ params: registration }) =>
        this.isDefaultModel(registration) ? NEVER : this.#reject(registration),
      equal: (registration1, registration2) => registration1.id === registration2.id,
    });
  }

  #reject(registration: Registration): Observable<Registration> {
    return this.httpClient
      .put<RegistrationDto>(`${this.API_ENDPOINT}/${registration.id}/reject`, registration)
      .pipe(
        map((dto) => this.mapper.mapOne(dto)),
        tap((registration) => this.#updateRegistration(registration)),
        catchError((error) => {
          console.error('Failed to approve an registration', error);
          return throwError(() => error);
        }),
      );
  }

  #updateRegistration(registration: Registration): void {
    this.modelsSignal.update((registrations) => {
      const exists = registrations.find((stored) => stored.id === registration.id);
      if (!exists) return [...registrations, registration];
      return registrations.map((stored) => (stored.id === registration.id ? registration : stored));
    });
  }
}
