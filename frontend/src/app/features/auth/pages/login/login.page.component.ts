import { Component, computed, inject, signal } from '@angular/core';
import { LoginFormComponent } from '../../components/login-form/login-form.component';
import { AuthService } from '../../services/auth.service';
import { AuthRequest } from '../../interfaces/auth.interface';

@Component({
  selector: 'app-home',
  imports: [LoginFormComponent],
  template: ` <app-login-form (sendLogin)="login($event)" /> `,
})
export class LoginPageComponent {
  readonly #authService = inject(AuthService);

  loginRequest = signal<AuthRequest>(this.#authService.defaultAuthRequest);

  loginResource = this.#authService.login(this.loginRequest);

  login(authRequest: AuthRequest) {
    this.loginRequest.set(authRequest);
  }
}
