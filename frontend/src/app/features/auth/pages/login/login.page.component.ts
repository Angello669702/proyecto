import { Component, computed, effect, inject, signal } from '@angular/core';
import { LoginFormComponent } from '../../components/login-form/login-form.component';
import { AuthService } from '../../services/auth.service';
import { AuthRequest } from '../../interfaces/auth.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [LoginFormComponent],
  template: `
    <div class="min-h-screen flex flex-col items-center justify-center bg-stone-50 px-6">
      @if (loginResource.status() === 'error') {
        <div
          class="w-full max-w-md mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-fade-in"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="#ef4444"
            viewBox="0 0 256 256"
            class="shrink-0 mt-0.5"
          >
            <path
              d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z"
            ></path>
          </svg>
          <div class="flex flex-col gap-1">
            <p class="text-[11px] font-bold uppercase tracking-wider text-red-600">
              Error de Autenticación
            </p>
            <p class="text-xs text-red-500 leading-tight">{{ message() }}</p>
          </div>
        </div>
      }

      <app-login-form class="w-full max-w-md" (login)="login($event)" />
    </div>
  `,
})
export class LoginPageComponent {
  readonly #authService = inject(AuthService);
  readonly #router = inject(Router);
  message = signal<string>('');

  loginRequest = signal<AuthRequest>(this.#authService.defaultAuthRequest);

  loginResource = this.#authService.login(this.loginRequest);

  navigateEffect = effect(() => {
    this.loginResource.status() === 'resolved'
      ? this.#router.navigate(['/home'])
      : this.message.set(
          this.loginResource.error()?.message || 'Credenciales incorrectas o error de servidor',
        );
  });

  login(authRequest: AuthRequest) {
    this.loginRequest.set(authRequest);
  }
}
