import { Component, computed, inject, signal } from '@angular/core';
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
      (removeCart)="removeFromCart($event)"
    />

    <!-- PAGINACIÓN -->
    <div class="flex items-center justify-center gap-1 mt-6">
      <!-- Prev -->
      <button
        (click)="prevPage()"
        [disabled]="page() === 1"
        class="w-8 h-8 font-mono text-sm bg-stone-100 border border-stone-300 rounded-sm
               hover:bg-stone-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        «
      </button>

      <!-- páginas -->
      @for (p of pages(); track p) {
        <button
          (click)="goToPage(p)"
          [class]="
            p === page()
              ? 'w-8 h-8 font-mono text-sm bg-stone-800 text-stone-100 border border-stone-800 rounded-sm'
              : 'w-8 h-8 font-mono text-sm bg-stone-100 border border-stone-300 rounded-sm hover:bg-stone-200 transition-colors'
          "
        >
          {{ p }}
        </button>
      }

      <!-- Next -->
      <button
        (click)="nextPage()"
        [disabled]="page() === totalPages()"
        class="w-8 h-8 font-mono text-sm bg-stone-100 border border-stone-300 rounded-sm
               hover:bg-stone-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        »
      </button>
    </div>
  `,
})
export class HomePageComponent {
  readonly #productService = inject(ProductService);
  readonly #transactionService = inject(TransactionService);

  page = signal(1);

  totalPages = signal(10);

  pages = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1));

  readonly products = this.#productService.models;

  productsResource = this.#productService.load(this.page);

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

  nextPage() {
    this.page.update((p) => p + 1);
  }

  prevPage() {
    this.page.update((p) => p - 1);
  }

  goToPage(p: number) {
    this.page.set(p);
  }
}
