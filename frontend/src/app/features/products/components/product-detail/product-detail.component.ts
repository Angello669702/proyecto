import { Component, CUSTOM_ELEMENTS_SCHEMA, input, output, signal } from '@angular/core';
import { Product } from '../../interfaces/product.interface';
import { CartItem } from '../../../../shared/interfaces/cart.interface';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { register } from 'swiper/element';
register();
@Component({
  selector: 'app-product-detail',
  imports: [CurrencyPipe, RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './product-detail.component.html',
})
export class ProductDetailComponent {
  readonly product = input.required<Product>();
  quantity = signal<number>(0);

  add = output<CartItem>();
  remove = output<CartItem>();

  addToCart() {
    this.add.emit({ product: this.product(), quantity: this.quantity() });
  }

  removeFromCart() {
    this.remove.emit({ product: this.product(), quantity: this.quantity() });
  }
}
