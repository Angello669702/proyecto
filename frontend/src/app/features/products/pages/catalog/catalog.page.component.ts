import { Component, computed, inject, signal } from '@angular/core';
import { CardListComponent } from '../../components/card-list/card-list.component';
import { TransactionService } from '../../../transactions/services/transaction.service';
import { Product } from '../../interfaces/product.interface';
import { ProductService } from '../../services/product.service';
import { CartItem } from '../../../../shared/interfaces/cart.interface';
import { PaginationButtonsComponent } from '../../../../shared/components/pagination-buttons/pagination-buttons.component';
import { ProductFilterComponent } from '../../components/product-filter/product-filter.component';
import { ProductFilter } from '../../interfaces/product-filter.interface';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-home',
  imports: [CardListComponent, PaginationButtonsComponent, ProductFilterComponent],
  template: `
    <div class="min-h-screen bg-stone-50 pt-16">
      <app-product-filter (filtersChanged)="onFiltersChanged($event)" />

      <main class="md:ml-72 flex flex-col min-h-[calc(100vh-64px)]">
        <section class="flex-1 pb-10">
          <div class="max-w-7xl mx-auto">
            <div class="px-8 pt-10 pb-4">
              <h2 class="text-sm font-serif font-bold uppercase tracking-[0.3em] text-stone-400">
                Nuestra Bodega
              </h2>
              <div class="h-px w-12 bg-rose-900 mt-2"></div>
            </div>

            <app-card-list
              [products]="products()"
              [isAdmin]="isAdmin()"
              [productsInCart]="productsInCart()"
              (add)="addToCart($event)"
              (removeCart)="removeFromCart($event)"
              (stock)="updateStock($event)"
              (isActive)="toggle($event)"
              (removeProduct)="deleteProduct($event)"
            />
          </div>
        </section>

        <footer
          class="sticky bottom-0 bg-white/80 backdrop-blur-md border-t border-stone-200 py-4 px-8 z-30"
        >
          <div class="max-w-7xl mx-auto flex justify-center">
            <app-pagination-buttons
              [(currentPage)]="currentPage"
              [lastPage]="lastPage()"
              [pages]="pages()"
            />
          </div>
        </footer>
      </main>
    </div>
  `,
})
export class CatalogPageComponent {
  readonly #productService = inject(ProductService);
  readonly #transactionService = inject(TransactionService);

  isAdmin = inject(AuthService).isAdmin;

  currentPage = signal<number>(1);
  lastPage = this.#productService.lastPage;
  pages = computed(() => Array.from({ length: this.lastPage() }, (_, i) => i + 1));

  filters = signal<ProductFilter>({
    categories: [],
    minPrice: null,
    maxPrice: null,
    searchText: '',
  });

  productsInCart = computed(() => {
    return this.#transactionService.cart().transactionsItems.map((item) => item.product);
  });

  readonly products = this.#productService.models;
  productsResource = this.#productService.loadPaginated(
    this.currentPage,
    this.#productService.buildParams(this.filters),
  );

  productToAddToCart = signal<CartItem>(this.#transactionService.defaultCartItem);
  productToRemoveFromCart = signal<CartItem>(this.#transactionService.defaultCartItem);

  productToUpdateStock = signal<CartItem>(this.#productService.defaultCartItem);
  productToRemove = signal<Product>(this.#productService.defaultModel);
  productToToggle = signal<Product>(this.#productService.defaultModel);

  addToCartResource = this.#transactionService.addItem(this.productToAddToCart);
  removeFromCartResource = this.#transactionService.removeItem(this.productToRemoveFromCart);

  updateStockResource = this.#productService.updateStock(this.productToUpdateStock);
  removeProductResource = this.#productService.remove(this.productToRemove);
  toggleProductResource = this.#productService.toggle(this.productToToggle);

  addToCart(product: Product) {
    this.productToAddToCart.set({ product: product, quantity: 1 });
  }

  removeFromCart(product: Product) {
    this.productToRemoveFromCart.set({ product: product, quantity: 1 });
  }

  updateStock(cartItem: CartItem) {
    this.productToUpdateStock.set(cartItem);
  }

  deleteProduct(product: Product) {
    this.productToRemove.set(product);
  }

  toggle(product: Product) {
    this.productToRemove.set(product);
  }

  onFiltersChanged(filters: ProductFilter) {
    this.filters.set(filters);
    this.currentPage.set(1);
  }
}
