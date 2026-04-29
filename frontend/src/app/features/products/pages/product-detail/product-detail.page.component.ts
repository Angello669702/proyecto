import { Component, effect, inject, input, signal } from '@angular/core';
import { TransactionService } from '../../../transactions/services/transaction.service';
import { Product } from '../../interfaces/product.interface';
import { ProductDetailComponent } from '../../components/product-detail/product-detail.component';
import { CartItem } from '../../../../shared/interfaces/cart.interface';

@Component({
  selector: 'app-home',
  imports: [ProductDetailComponent],
  template: ` <app-product-detail [product]="product()" (add)="addToCart($event)" /> `,
})
export class ProdcutDetailPageComponent {
  readonly product = input.required<Product>();
  readonly #transactionService = inject(TransactionService);

  productToAddToCart = signal<CartItem>(this.#transactionService.defaultCartItem);

  addToCartResource = this.#transactionService.addItem(this.productToAddToCart);

  addToCart(cartItem: CartItem) {
    this.productToAddToCart.set(cartItem);
  }
}
