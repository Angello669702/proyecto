import { Component, effect, inject, signal } from '@angular/core';
import { RegistrationService } from '../../services/registration.service';
import { Router } from '@angular/router';
import { RegistrationFormComponent } from '../../components/registration-form/registration-form.component';
import { Registration, RegistrationRequest } from '../../interfaces/registration.interface';
import { RegistrationMapper } from '../../mappers/registration.mapper';

@Component({
  selector: 'app-home',
  imports: [RegistrationFormComponent],
  template: ` <app-registration-form (register)="register($event)" /> `,
})
export class RegisterPageComponent {
  readonly #registrationService = inject(RegistrationService);
  readonly #router = inject(Router);
  readonly #mapper = inject(RegistrationMapper);

  messagge = signal<string>('');

  registration = signal<Registration>(this.#registrationService.defaultModel);
  registrationResource = this.#registrationService.add(this.registration);

  navigateEffect = effect(() => {
    this.registrationResource.status() === 'resolved'
      ? this.#router.navigate(['/home'])
      : this.messagge.set(this.registrationResource.error()?.message ?? 'Error de servidor');
  });

  register(registration: RegistrationRequest) {
    this.registration.set(registration as Registration);
  }
}
