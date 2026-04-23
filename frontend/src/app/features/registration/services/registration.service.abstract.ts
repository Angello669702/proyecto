import { ResourceRef, Signal } from '@angular/core';
import { Registration } from '../interfaces/registration.interface';

export abstract class RegistrationServiceAbstract {
  protected readonly API_ENDPOINT = 'http://localhost:8000/Registrations';

  readonly defaultRegistration: Registration = {
    id: '',
  } as Registration;

  abstract load(): ResourceRef<Registration[] | undefined>;
  abstract add(registration: Signal<Registration>): ResourceRef<Registration | undefined>;
  abstract update(
    registrationToUpdate: Signal<Registration>,
  ): ResourceRef<Registration | undefined>;
  abstract remove(registration: Signal<Registration>): ResourceRef<Registration | undefined>;
  abstract find(id: Signal<number>): ResourceRef<Registration | undefined>;

  isDefaultRegistration(registration: Registration): boolean {
    return registration.id === this.defaultRegistration.id;
  }
}
