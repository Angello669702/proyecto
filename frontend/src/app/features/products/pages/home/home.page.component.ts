import { Component, inject, signal } from '@angular/core';
import { CardListComponent } from '../../components/card-list/card-list.component';
import { TransactionService } from '../../../transactions/services/transaction.service';
import { Product } from '../../interfaces/product.interface';
import { ProductService } from '../../services/product.service';
import { CartItem } from '../../../../shared/interfaces/cart.interface';

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
export class HomePageComponent {
  readonly #productService = inject(ProductService);
  readonly #transactionService = inject(TransactionService);

  readonly products = this.#productService.models;

  productsResource = this.#productService.load();

  productToAddToCart = signal<CartItem>(this.#transactionService.defaultCartItem);
  productToRemoveFromCart = signal<CartItem>(this.#transactionService.defaultCartItem);

  addToCartResource = this.#transactionService.addItem(this.productToAddToCart);
  removeFromCartResource = this.#transactionService.removeItem(this.productToRemoveFromCart);

  addToCart(product: Product) {
    this.productToAddToCart.set({ product: product, quantity: 1 });
  }

  removeFromCart(product: Product) {
    this.productToRemoveFromCart.set({ product: product, quantity: 1 });
  }
}

/*
<div class="flex items-center justify-center gap-1">
    <button
      [disabled]="currentPage() === 1"
      (click)="onPageChange(currentPage() - 1)"
      class="w-8 h-8 font-mono text-sm bg-stone-100 border border-stone-300 rounded-sm hover:bg-stone-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
    >
      «
    </button>

    @for (page of totalPages(); track page) {
      <button
        (click)="onPageChange(page)"
        [class]="page === currentPage()
          ? 'w-8 h-8 font-mono text-sm bg-stone-800 text-stone-100 border border-stone-800 rounded-sm'
          : 'w-8 h-8 font-mono text-sm bg-stone-100 border border-stone-300 rounded-sm hover:bg-stone-200 transition-colors'"
      >
        {{ page }}
      </button>
    }

    <button
      [disabled]="currentPage() === totalPages().length"
      (click)="onPageChange(currentPage() + 1)"
      class="w-8 h-8 font-mono text-sm bg-stone-100 border border-stone-300 rounded-sm hover:bg-stone-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
    >
      »
    </button>
  </div>
*/
