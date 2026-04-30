import { Component, inject, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthRequest } from '../../interfaces/auth.interface';

@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule],
  templateUrl: './login-form.component.html',
})
export class LoginFormComponent {
  sendLogin = output<AuthRequest>();
  readonly #formBuilder = inject(FormBuilder);
  message = signal<string>('');

  public loginForm: FormGroup = this.#formBuilder.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  login() {
    if (this.loginForm.invalid) {
      this.message.set('Please correct all errors and resubmit the form');
    } else {
      this.sendLogin.emit(this.loginForm.value);
    }
  }
}
