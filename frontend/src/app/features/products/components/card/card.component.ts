import { Component, computed, input, output } from '@angular/core';
import { Product } from '../../interfaces/product.interface';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-card-product',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './card.component.html',
})
export class CardComponent {
  readonly product = input.required<Product>();
  add = output<Product>();
  remove = output<Product>();

  readonly detailRoute = computed(() => `/products/${this.product().id}`);

  addToCart() {
    this.add.emit(this.product());
  }

  removeFromCart() {
    this.remove.emit(this.product());
  }
}
