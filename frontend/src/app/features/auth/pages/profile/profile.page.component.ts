import { Component, effect, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UserFormComponent } from '../../components/user-form/user-form.component';
import { UserService } from '../../services/user.service';
import { ChangePassword } from '../../interfaces/user.interface';
import Swal from 'sweetalert2';
import { AlertService } from '../../../../shared/services/alert.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [UserFormComponent],
  template: `
    <main class="min-h-screen bg-stone-50 pt-24 pb-12">
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
  readonly #alertService = inject(AlertService);
  readonly #router = inject(Router);

  user = this.#authService.currentUser;

  userToUpdate = signal<FormData | null>(null);
  userResource = this.#userService.updateProfile(this.userToUpdate);

  changePasswordSignal = signal<ChangePassword>(this.#userService.defaultChangePassword);
  changePasswordResource = this.#userService.changePassword(this.changePasswordSignal);

  navigateEffect = effect(() => {
    const status = this.userResource.status();

    if (status === 'resolved') {
      this.#alertService.success('Perfil actualizado correctamente');

      this.#authService.reloadUser();

      setTimeout(() => {
        this.#router.navigate(['/home']);
      }, 1500);
    }

    if (status === 'error') {
      const errorMsg = this.userResource.error() as any;

      this.#alertService.modalError('Error al actualizar', errorMsg?.message || 'Hubo un problema');
    }
  });

  changePasswordEffect = effect(() => {
    const status = this.changePasswordResource.status();

    if (status === 'resolved') {
      this.#alertService.success('Contraseña actualizada con éxito');
    }

    if (status === 'error') {
      const errorMsg = this.changePasswordResource.error() as any;

      this.#alertService.modalError(
        'Error de contraseña',
        errorMsg?.message || 'Asegúrate de que la contraseña actual es correcta',
      );
    }
  });

  updateUser(userToUpdate: FormData) {
    this.userToUpdate.set(userToUpdate);
  }

  changePassword(changePasswordRequest: ChangePassword) {
    this.changePasswordSignal.set(changePasswordRequest);
  }
}
