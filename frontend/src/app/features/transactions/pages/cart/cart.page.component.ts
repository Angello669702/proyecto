import { Component, computed, effect, inject, signal } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { CartItem } from '../../../../shared/interfaces/cart.interface';
import { ProductFilter } from '../../../products/interfaces/product-filter.interface';
import { Product } from '../../../products/interfaces/product.interface';
import { ProductService } from '../../../products/services/product.service';
import { TransactionService } from '../../services/transaction.service';
import { CartComponent } from '../../components/cart/cart.component';
import { Transaction } from '../../interfaces/transaction.interface';

@Component({
  selector: 'app-home',
  imports: [CartComponent],
  template: ` <app-cart
    [transaction]="transaction()"
    (add)="addToCart($event)"
    (remove)="removeFromCart($event)"
  />`,
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
}
