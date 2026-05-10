import { Component, inject, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PriceGroup } from '../../interfaces/price-group.interface';

@Component({
  selector: 'app-price-group-form',
  imports: [ReactiveFormsModule],
  templateUrl: './price-group-form.component.html',
})
export class PriceGroupFormComponent {
  create = output<PriceGroup>();
  readonly #formBuilder = inject(FormBuilder);
  message = signal<string>('');

  public priceGroupForm: FormGroup = this.#formBuilder.group({
    name: ['', [Validators.required]],
    description: ['', [Validators.required]],
  });

  sendForm() {
    if (this.priceGroupForm.invalid) {
      this.message.set('Please correct all errors and resubmit the form');
    } else {
      this.create.emit(this.priceGroupForm.value);
    }
  }
}
