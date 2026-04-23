import { computed, inject, Injectable, ResourceRef, Signal, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, NEVER, Observable, tap, throwError } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';
import { RegistrationDto } from '../dtos/registration.interface.dto';
import { Registration } from '../interfaces/registration.interface';
import { RegistrationMapper } from '../mappers/registration.mapper';
import { RegistrationServiceAbstract } from './registration.service.abstract';

@Injectable({ providedIn: 'root' })
export class RegistrationService extends RegistrationServiceAbstract {
  readonly #httpClient = inject(HttpClient);
  readonly #registrationMapper = inject(RegistrationMapper);
  #registrationsSignal = signal<Registration[]>([]);
  registrations = computed(() => this.#registrationsSignal());

  load(): ResourceRef<Registration[] | undefined> {
    return rxResource({
      stream: () => this.#load(),
    });
  }

  #load(): Observable<Registration[]> {
    return this.#httpClient.get<RegistrationDto[]>(this.API_ENDPOINT).pipe(
      map((registrationsDtos) => this.#registrationMapper.mapList(registrationsDtos)),
      tap((registrations) => this.#registrationsSignal.set(registrations)),
      catchError((error) => {
        console.error('Failed to load registrations', error);
        return throwError(() => error);
      }),
    );
  }

  add(registration: Signal<Registration>): ResourceRef<Registration | undefined> {
    return rxResource({
      params: () => registration(),
      stream: ({ params: registration }) =>
        this.isDefaultRegistration(registration) ? NEVER : this.#add(registration),
      equal: (registration1, registration2) => registration1.id === registration2.id,
    });
  }

  #add(registration: Registration): Observable<Registration> {
    return this.#httpClient.post<RegistrationDto>(this.API_ENDPOINT, registration).pipe(
      map((registrationDto) => this.#registrationMapper.mapOne(registrationDto)),
      tap((newregistration) =>
        this.#registrationsSignal.update((currentRegistrations) => [
          ...currentRegistrations,
          newregistration,
        ]),
      ),
      catchError((error) => {
        console.error('Failed to add an registration', error);
        return throwError(() => error);
      }),
    );
  }

  update(registration: Signal<Registration>): ResourceRef<Registration | undefined> {
    return rxResource({
      params: () => registration(),
      stream: ({ params: registration }) =>
        this.isDefaultRegistration(registration) ? NEVER : this.#update(registration),
      equal: (registration1, registration2) => registration1.id === registration2.id,
    });
  }

  #update(registration: Registration): Observable<Registration> {
    return this.#httpClient
      .put<RegistrationDto>(`${this.API_ENDPOINT}/${registration.id}`, registration)
      .pipe(
        map((registrationDto) => this.#registrationMapper.mapOne(registrationDto)),
        tap((updatedregistration) =>
          this.#registrationsSignal.update((currentRegistrations) =>
            currentRegistrations.map((currentRegistration) =>
              currentRegistration.id === updatedregistration.id
                ? updatedregistration
                : currentRegistration,
            ),
          ),
        ),
        catchError((error) => {
          console.error('Failed to update a registration', error);
          return throwError(() => error);
        }),
      );
  }

  remove(registration: Signal<Registration>): ResourceRef<Registration | undefined> {
    return rxResource({
      params: () => registration(),
      stream: ({ params: registration }) =>
        this.isDefaultRegistration(registration) ? NEVER : this.#remove(registration),
      equal: (registration1, registration2) => registration1.id === registration2.id,
    });
  }

  #remove(registration: Registration): Observable<Registration> {
    return this.#httpClient.delete<RegistrationDto>(`${this.API_ENDPOINT}/${registration.id}`).pipe(
      map((registrationDto) => this.#registrationMapper.mapOne(registrationDto)),
      tap(() =>
        this.#registrationsSignal.update((currentRegistrations) =>
          currentRegistrations.filter(
            (currentRegistration) => currentRegistration.id !== registration.id,
          ),
        ),
      ),
      catchError((error) => {
        console.error('Error deleting registration', error);
        return throwError(() => error);
      }),
    );
  }

  find(id: Signal<number>): ResourceRef<Registration | undefined> {
    return rxResource({
      params: () => id(),
      stream: ({ params: id }) => (id === 0 ? NEVER : this.#find(id)),
    });
  }

  #find(id: number): Observable<Registration> {
    return this.#httpClient
      .get<RegistrationDto>(`${this.API_ENDPOINT}/${id}`)
      .pipe(map((registrationDto) => this.#registrationMapper.mapOne(registrationDto)));
  }
}
