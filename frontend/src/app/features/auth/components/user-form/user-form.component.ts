import { Component, effect, inject, input, output, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ChangePassword, User } from '../../interfaces/user.interface';

@Component({
  selector: 'app-user-form',
  imports: [ReactiveFormsModule],
  templateUrl: './user-form.component.html',
})
export class UserFormComponent {
  readonly #formBuilder = inject(FormBuilder);

  user = input.required<User>();
  updatedUser = output<FormData>();

  showPasswordForm = signal<boolean>(false);
  changePassword = output<ChangePassword>();

  #selectedFile = signal<File | null>(null);
  previewUrl = signal<string | null>(null);

  message = signal<string>('');

  public userForm: FormGroup = this.#formBuilder.group({
    name: ['', [Validators.required]],
    fullName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    companyName: ['', [Validators.required]],
    nif: ['', [Validators.required]],
    phone: ['', [Validators.required]],
    address: ['', [Validators.required]],
  });

  public passwordForm: FormGroup = this.#formBuilder.group(
    {
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: this.passwordMatchValidator },
  );

  fillForm = effect(() => {
    const user = this.user();
    this.userForm.patchValue(user);
  });

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPass = control.get('newPassword')?.value;
    const confirmPass = control.get('confirmPassword')?.value;
    return newPass === confirmPass ? null : { passwordMismatch: true };
  }

  togglePasswordForm() {
    this.showPasswordForm.update((value) => !value);
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.message.set('Por favor, selecciona un archivo de imagen válido.');
      return;
    }

    this.#selectedFile.set(file);
    this.previewUrl.set(URL.createObjectURL(file));
    this.message.set('');
  }

  sendProfileUpdate() {
    if (this.userForm.invalid) {
      this.message.set('Por favor corrige los errores del formulario.');
      return;
    }

    const formData = new FormData();
    const values = this.userForm.value;

    formData.append('name', values.name);
    formData.append('full_name', values.fullName);
    formData.append('email', values.email);
    formData.append('company_name', values.companyName);
    formData.append('nif', values.nif);
    formData.append('phone', values.phone ?? '');
    formData.append('address', values.address ?? '');

    const file = this.#selectedFile();
    if (file) {
      formData.append('profile_photo', file);
    }

    this.updatedUser.emit(formData);
  }

  sendPasswordUpdate() {
    if (this.passwordForm.invalid) {
      this.message.set('Las contraseñas no coinciden o son inválidas.');
      return;
    }
    const { currentPassword, newPassword } = this.passwordForm.value;
    this.changePassword.emit({ currentPassword: currentPassword, newPassword: newPassword });
    this.passwordForm.reset();
    this.showPasswordForm.set(false);
  }
}
