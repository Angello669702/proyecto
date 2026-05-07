import { Component, computed, inject, input, model, output, signal } from '@angular/core';
import { Product } from '../../interfaces/product.interface';
import { CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartItem } from '../../../../shared/interfaces/cart.interface';

@Component({
  selector: 'app-card-product',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './card.component.html',
})
export class CardComponent {
  readonly product = input.required<Product>();
  readonly isAdmin = input<boolean>(false);
  readonly isLogged = input<boolean>(false);
  readonly featured = input<boolean>(false);
  readonly isFavourite = input<boolean>(false);
  isProductInCart = model<boolean>(false);

  readonly #router = inject(Router);

  quantity = signal<number>(0);

  add = output<Product>();
  removeCart = output<Product>();
  favourite = output<Product>();

  removeProduct = output<Product>();
  isActive = output<Product>();
  stock = output<CartItem>();

  readonly detailRoute = computed(() => ['/', 'products', '/', this.product().id]);
  readonly updateRoute = computed(() => ['/', 'products', '/', 'update', '/', this.product().id]);
  readonly loginRoute = computed(() => ['/', 'auth', '/', 'login']);

  addToCart() {
    this.add.emit(this.product());
  }

  removeFromCart() {
    this.removeCart.emit(this.product());
  }

  toggleFavourite() {
    this.favourite.emit(this.product());
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

  navigate(route: string[]) {
    this.#router.navigate(route);
  }
}
