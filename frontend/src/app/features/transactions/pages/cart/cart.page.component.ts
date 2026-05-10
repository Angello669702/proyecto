import { Component, inject, signal } from '@angular/core';
import { CartItem } from '../../../../shared/interfaces/cart.interface';
import { TransactionService } from '../../services/transaction.service';
import { CartComponent } from '../../components/cart/cart.component';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-home',
  imports: [CartComponent, LoadingComponent],
  template: `
    <div class="min-h-screen bg-stone-50 pt-20 px-6">
      @if (cartResource.isLoading()) {
        <app-loading />
      } @else {
        <app-cart
          [transaction]="transaction()"
          (add)="addToCart($event)"
          (remove)="removeFromCart($event)"
          (checkout)="checkout()"
        />
      }
    </div>
  `,
})
export class CartPageComponent {
  readonly #transactionService = inject(TransactionService);

  readonly transaction = this.#transactionService.cart;
  cartResource = this.#transactionService.myCart();

  productToAddToCart = signal<CartItem>(this.#transactionService.defaultCartItem);
  productToRemoveFromCart = signal<CartItem>(this.#transactionService.defaultCartItem);

  addToCartResource = this.#transactionService.addItem(this.productToAddToCart);
  removeFromCartResource = this.#transactionService.removeItem(this.productToRemoveFromCart);

  addToCart(cartItem: CartItem) {
    this.productToAddToCart.set(cartItem);
  }

  removeFromCart(cartItem: CartItem) {
    this.productToRemoveFromCart.set(cartItem);
  }

  checkout() {
    this.#transactionService.createCheckoutSession().subscribe({
      next: ({ url }) => (window.location.href = url),
      error: () => console.error('Error al iniciar el pago'),
    });
  }
}
