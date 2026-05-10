import { Component, effect, inject, signal } from '@angular/core';
import { RegistrationService } from '../../services/registration.service';
import { Router } from '@angular/router';
import { RegistrationFormComponent } from '../../components/registration-form/registration-form.component';
import { Registration, RegistrationRequest } from '../../interfaces/registration.interface';
import { AlertService } from '../../../../shared/services/alert.service';

@Component({
  selector: 'app-home',
  imports: [RegistrationFormComponent],
  template: ` <app-registration-form (register)="register($event)" /> `,
})
export class RegisterPageComponent {
  readonly #registrationService = inject(RegistrationService);
  readonly #router = inject(Router);
  readonly #alertService = inject(AlertService);

  messagge = signal<string>('');

  registration = signal<Registration>(this.#registrationService.defaultModel);
  registrationResource = this.#registrationService.add(this.registration);

  navigateEffect = effect(() => {
    const status = this.registrationResource.status();

    if (status === 'resolved') {
      this.#alertService.success('Solicitud de registro enviada correctamente');

      setTimeout(() => {
        this.#router.navigate(['/home']);
      }, 1000);
    }

    if (status === 'error') {
      const errorMessage = this.registrationResource.error()?.message ?? 'Error de servidor';

      this.messagge.set(errorMessage);

      this.#alertService.modalError('Error de registro', errorMessage);
    }
  });

  register(registration: RegistrationRequest) {
    this.registration.set(registration as Registration);
  }
}
