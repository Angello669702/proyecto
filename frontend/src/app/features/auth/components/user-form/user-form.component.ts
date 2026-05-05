import { Component, inject, input, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../interfaces/user.interface';

@Component({
  selector: 'app-user-form',
  imports: [ReactiveFormsModule],
  templateUrl: './user-form.component.html',
})
export class LoginFormComponent {
  user = input.required<User>();
  updatedUser = output<User>();
  readonly #formBuilder = inject(FormBuilder);
  message = signal<string>('');

  public userForm: FormGroup = this.#formBuilder.group({
    name: ['', [Validators.required]],
    fullName: ['', [Validators.required]],
    email: ['', [Validators.required]],
    password: ['', [Validators.required]],
    newPassword: ['', [Validators.required]],
    companyName: ['', [Validators.required]],
    phone: ['', [Validators.required]],
    address: ['', [Validators.required]],
    profilePhoto: ['', [Validators.required]],
  });

  sendForm() {
    if (this.userForm.invalid) {
      this.message.set('Please correct all errors and resubmit the form');
    } else {
      this.updatedUser.emit(this.userForm.value);
    }
  }
}
