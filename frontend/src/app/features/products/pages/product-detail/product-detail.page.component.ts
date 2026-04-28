import { Component, inject, signal } from '@angular/core';
import { CardListComponent } from '../../components/card-list/card-list.component';
import { TransactionService } from '../../../transactions/services/transaction.service';
import { Product } from '../../interfaces/product.interface';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-home',
  imports: [CardListComponent],
  template: `
    <app-card-list
      [products]="products()"
      (add)="addToCart($event)"
      (remove)="removeFromCart($event)"
    >
    </app-card-list>
  `,
})
export class ProdcutDeatilPageComponent {
  readonly #productService = inject(ProductService);
  readonly #transactionService = inject(TransactionService);

  readonly products = this.#productService.models;

  productsResource = this.#productService.load();

  productToAddToCart = signal<Product>(this.#productService.defaultModel);
  productToRemoveFromCart = signal<Product>(this.#productService.defaultModel);

  addToCart(product: Product) {
    this.productToAddToCart.set(product);
  }

  removeFromCart(product: Product) {
    this.productToRemoveFromCart.set(product);
  }
}
