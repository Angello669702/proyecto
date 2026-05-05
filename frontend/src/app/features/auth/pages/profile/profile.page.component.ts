import { Component, effect, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UserFormComponent } from '../../components/user-form/user-form.component';
import { UserService } from '../../services/user.service';
import { ChangePassword, User, UserRequest } from '../../interfaces/user.interface';

@Component({
  selector: 'app-profile',
  imports: [UserFormComponent],
  template: `
    <main class="min-h-screen bg-stone-50 pt-24 pb-12">
      @if (message()) {
        <div class="max-w-4xl mx-auto px-6 mb-6">
          <div
            class="bg-rose-50 border border-rose-200 text-rose-900 px-4 py-3 rounded-xl flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-4 duration-300"
          >
            <div class="flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-rose-800"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span class="text-xs font-bold uppercase tracking-widest">{{ message() }}</span>
            </div>
            <button
              (click)="message.set('')"
              class="text-rose-900/50 hover:text-rose-900 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      }

      <app-user-form
        [user]="user()"
        (updatedUser)="updateUser($event)"
        (changePassword)="changePassword($event)"
      >
      </app-user-form>
    </main>
  `,
})
export class ProfilePageComponent {
  readonly #authService = inject(AuthService);
  readonly #userService = inject(UserService);
  readonly #router = inject(Router);
  message = signal<string>('');

  user = this.#authService.currentUser;

  userToUpdate = signal<FormData | null>(null);
  userResource = this.#userService.updateProfile(this.userToUpdate);

  changePasswordSignal = signal<ChangePassword>(this.#userService.defaultChangePassword);
  changePasswordResource = this.#userService.changePassword(this.changePasswordSignal);

  navigateEffect = effect(() => {
    const status = this.userResource.status();

    if (status === 'resolved') {
      this.#router.navigate(['/home']);
    }

    if (status === 'error') {
      const errorMsg = this.userResource.error() as any;
      this.message.set(errorMsg?.message || 'Error al actualizar el perfil');
    }
  });

  changePasswordEffect = effect(() => {
    const status = this.changePasswordResource.status();

    if (status === 'resolved') {
      this.message.set('Contraseña actualizada con éxito');
      setTimeout(() => this.message.set(''), 3000);
    } else if (status === 'error') {
      const errorMsg = this.changePasswordResource.error() as any;
      this.message.set(errorMsg?.message || 'Error al cambiar la contraseña');
    }
  });

  updateUser(userToUpdate: FormData) {
    this.userToUpdate.set(userToUpdate);
  }

  changePassword(changePasswordRequest: ChangePassword) {
    this.changePasswordSignal.set(changePasswordRequest);
  }
}
