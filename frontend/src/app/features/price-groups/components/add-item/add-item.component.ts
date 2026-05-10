import { Component, computed, inject, input, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { PriceGroup } from '../../interfaces/price-group.interface';
import { Product } from '../../../products/interfaces/product.interface';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-add-item',
  imports: [ReactiveFormsModule, NgSelectModule, CurrencyPipe],
  templateUrl: './add-item.component.html',
})
export class AddItemComponent {
  priceGroup = input.required<PriceGroup>();
  products = input.required<Product[]>();

  readonly #formBuilder = inject(FormBuilder);
  message = signal<string>('');

  form: FormGroup = this.#formBuilder.group({
    product: [null, [Validators.required]],
    price: [null, [Validators.required, Validators.min(0)]],
  });

  addItem = output<{ priceGroup: PriceGroup; item: { product: Product; price: number } }>();

  availableProducts = computed(() => {
    const existingIds = new Set(this.priceGroup().items?.map((i) => i.product.id) ?? []);
    return this.products().filter((p) => !existingIds.has(p.id));
  });

  sendAddItem() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.message.set('Por favor, completa todos los campos.');
      return;
    }
    this.message.set('');
    this.addItem.emit({
      priceGroup: this.priceGroup(),
      item: {
        product: this.form.value.product,
        price: this.form.value.price,
      },
    });
    this.form.reset();
  }
}
