import { Component, computed, input, output, signal } from '@angular/core';
import { Product } from '../../interfaces/product.interface';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartItem } from '../../../../shared/interfaces/cart.interface';

@Component({
  selector: 'app-card-product',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './card.component.html',
})
export class CardComponent {
  readonly product = input.required<Product>();
  readonly isAdmin = input<boolean>(false);

  quantity = signal<number>(0);

  add = output<Product>();
  removeCart = output<Product>();

  removeProduct = output<Product>();
  isActive = output<Product>();
  stock = output<CartItem>();

  readonly detailRoute = computed(() => `/products/${this.product().id}`);

  addToCart() {
    this.add.emit(this.product());
  }

  removeFromCart() {
    this.removeProduct.emit(this.product());
  }

  deleteProduct() {
    this.removeProduct.emit(this.product());
  }

  toggleProduct() {
    this.isActive.emit(this.product());
  }

  addStock() {
    this.stock.emit({ product: this.product(), quantity: this.quantity() });
  }

  removeStock() {
    this.stock.emit({ product: this.product(), quantity: -this.quantity() });
  }
}
