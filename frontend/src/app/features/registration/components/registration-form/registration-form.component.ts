import { Component, inject, output, signal } from '@angular/core';
import { Registration, RegistrationRequest } from '../../interfaces/registration.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-registration-form',
  imports: [ReactiveFormsModule],
  templateUrl: './registration-form.component.html',
})
export class RegistrationFormComponent {
  register = output<RegistrationRequest>();
  readonly #formBuilder = inject(FormBuilder);
  message = signal<string>('');

  public registrationForm: FormGroup = this.#formBuilder.group({
    companyName: ['', [Validators.required]],
    nif: ['', [Validators.required]],
    contactName: ['', [Validators.required]],
    email: ['', [Validators.required]],
    phone: ['', [Validators.required]],
    address: ['', [Validators.required]],
    notes: [''],
  });

  submitForm() {
    if (this.registrationForm.invalid) {
      this.message.set('Please correct all errors and resubmit the form');
    } else {
      this.register.emit(this.registrationForm.value);
    }
  }
}
