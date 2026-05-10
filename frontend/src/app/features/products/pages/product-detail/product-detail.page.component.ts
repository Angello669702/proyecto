import { Component, effect, inject, input, signal } from '@angular/core';
import { TransactionService } from '../../../transactions/services/transaction.service';
import { Product } from '../../interfaces/product.interface';
import { ProductDetailComponent } from '../../components/product-detail/product-detail.component';
import { CartItem } from '../../../../shared/interfaces/cart.interface';
import { AlertService } from '../../../../shared/services/alert.service';

@Component({
  selector: 'app-home',
  imports: [ProductDetailComponent],
  template: ` <app-product-detail [product]="product()" (add)="addToCart($event)" /> `,
})
export class ProductDetailPageComponent {
  readonly product = input.required<Product>();
  readonly #transactionService = inject(TransactionService);
  readonly #alertService = inject(AlertService);

  addToCartEffect = effect(() => {
    const status = this.addToCartResource.status();
    const product = this.productToAddToCart().product;

    if (status === 'resolved') {
      this.#alertService.success(`${product.name} añadido al carrito`);
    }

    if (status === 'error') {
      this.#alertService.error('No se pudo añadir al carrito');
    }
  });

  productToAddToCart = signal<CartItem>(this.#transactionService.defaultCartItem);

  addToCartResource = this.#transactionService.addItem(this.productToAddToCart);

  addToCart(cartItem: CartItem) {
    this.productToAddToCart.set(cartItem);
  }
}
