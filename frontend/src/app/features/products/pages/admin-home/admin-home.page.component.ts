import { Component, inject, signal } from '@angular/core';
import { CardListComponent } from '../../components/card-list/card-list.component';
import { TransactionService } from '../../../transactions/services/transaction.service';
import { Product } from '../../interfaces/product.interface';
import { ProductService } from '../../services/product.service';
import { CartItem } from '../../../../shared/interfaces/cart.interface';

@Component({
  selector: 'app-admin-home',
  imports: [CardListComponent],
  template: `
    <app-card-list
      [products]="products()"
      (stock)="updateStock($event)"
      (isActive)="toggle($event)"
      (removeProduct)="deleteProduct($event)"
    >
    </app-card-list>
  `,
})
export class AdminHomePageComponent {
  readonly #productService = inject(ProductService);
  readonly products = this.#productService.models;

  page = signal<number>(1);

  productsResource = this.#productService.load(this.page);

  productToUpdateStock = signal<CartItem>(this.#productService.defaultCartItem);
  productToRemove = signal<Product>(this.#productService.defaultModel);
  productToToggle = signal<Product>(this.#productService.defaultModel);

  updateStockResource = this.#productService.updateStock(this.productToUpdateStock);
  removeProductResource = this.#productService.remove(this.productToRemove);
  toggleProductResource = this.#productService.toggle(this.productToToggle);

  updateStock(cartItem: CartItem) {
    this.productToUpdateStock.set(cartItem);
  }

  deleteProduct(product: Product) {
    this.productToRemove.set(product);
  }

  toggle(product: Product) {
    this.productToRemove.set(product);
  }
}
