import { Component, computed, effect, inject, signal } from '@angular/core';
import { LoginFormComponent } from '../../components/login-form/login-form.component';
import { AuthService } from '../../services/auth.service';
import { AuthRequest } from '../../interfaces/auth.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [LoginFormComponent],
  template: ` <app-login-form (sendLogin)="login($event)" /> `,
})
export class LoginPageComponent {
  readonly #authService = inject(AuthService);
  readonly #router = inject(Router);
  message = signal<string>('');

  loginRequest = signal<AuthRequest>(this.#authService.defaultAuthRequest);

  loginResource = this.#authService.login(this.loginRequest);

  navigateEffect = effect(() => {
    this.loginResource.status() === 'resolved'
      ? this.#router.navigate(['/home', 'home'])
      : this.message.set(String(this.loginResource.error()));
  });

  login(authRequest: AuthRequest) {
    this.loginRequest.set(authRequest);
  }
}
