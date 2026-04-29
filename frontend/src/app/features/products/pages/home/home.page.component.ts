import { Component, computed, inject, signal } from '@angular/core';
import { CardListComponent } from '../../components/card-list/card-list.component';
import { TransactionService } from '../../../transactions/services/transaction.service';
import { Product } from '../../interfaces/product.interface';
import { ProductService } from '../../services/product.service';
import { CartItem } from '../../../../shared/interfaces/cart.interface';
import { PaginationButtonsComponent } from '../../../../shared/components/pagination-buttons/pagination-buttons.component';
import { ProductFilterComponent } from '../../components/product-filter/product-filter.component';
import { ProductFilter } from '../../interfaces/product-filter.interface';

@Component({
  selector: 'app-home',
  imports: [CardListComponent, PaginationButtonsComponent, ProductFilterComponent],
  template: `
    <div class="flex h-[calc(100vh-4rem)] overflow-hidden">
      <aside class="w-64 border-r border-stone-300 p-4">
        <app-product-filter (filtersChanged)="onFiltersChanged($event)" />
      </aside>

      <div class="flex-1 flex flex-col min-h-0">
        <div class="flex-1 p-4 overflow-hidden flex min-h-0">
          <app-card-list
            class="flex-1"
            [products]="products()"
            (add)="addToCart($event)"
            (removeCart)="removeFromCart($event)"
          />
        </div>
        <div class="p-2 border-t border-stone-300">
          <app-pagination-buttons
            [(currentPage)]="currentPage"
            [lastPage]="lastPage()"
            [pages]="pages()"
          />
        </div>
      </div>
    </div>
  `,
})
export class HomePageComponent {
  readonly #productService = inject(ProductService);
  readonly #transactionService = inject(TransactionService);

  currentPage = signal<number>(1);
  lastPage = this.#productService.lastPage;
  pages = computed(() => Array.from({ length: this.lastPage() }, (_, i) => i + 1));

  filters = signal<ProductFilter>({
    categories: [],
    minPrice: null,
    maxPrice: null,
    searchText: '',
  });

  readonly products = this.#productService.models;
  productsResource = this.#productService.load(
    this.currentPage,
    this.#productService.buildFilters(this.filters),
  );

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

  onFiltersChanged(filters: ProductFilter) {
    this.filters.set(filters);
    this.currentPage.set(1);
  }
}
