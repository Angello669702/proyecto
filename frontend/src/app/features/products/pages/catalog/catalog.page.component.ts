import { Component, computed, effect, inject, signal } from '@angular/core';
import { CardListComponent } from '../../components/card-list/card-list.component';
import { TransactionService } from '../../../transactions/services/transaction.service';
import { Product } from '../../interfaces/product.interface';
import { ProductService } from '../../services/product.service';
import { CartItem } from '../../../../shared/interfaces/cart.interface';
import { PaginationButtonsComponent } from '../../../../shared/components/pagination-buttons/pagination-buttons.component';
import { ProductFilterComponent } from '../../components/product-filter/product-filter.component';
import { ProductFilter } from '../../interfaces/product-filter.interface';
import { AuthService } from '../../../auth/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { LoadingGridComponent } from '../../../../shared/components/loading/loading-grid.component';
import { TokenStorageService } from '../../../auth/services/token.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-catalog',
  imports: [
    CardListComponent,
    PaginationButtonsComponent,
    ProductFilterComponent,
    LoadingGridComponent,
  ],
  template: `
    <div class="min-h-screen bg-stone-50 pt-16">
      <app-product-filter
        [initialFilters]="filters()"
        (filtersChanged)="onFiltersChanged($event)"
      />

      <main class="md:ml-72 flex flex-col min-h-[calc(100vh-64px)]">
        <section class="flex-1 pb-10">
          <div class="max-w-7xl mx-auto">
            <div class="px-8 pt-10 pb-4">
              <h2 class="text-sm font-serif font-bold uppercase tracking-[0.3em] text-stone-400">
                Nuestra Bodega
              </h2>
              <div class="h-px w-12 bg-rose-900 mt-2"></div>
            </div>

            @if (productsResource.isLoading()) {
              <div class="px-8">
                <app-loading-grid [length]="9" />
              </div>
            } @else {
              <app-card-list
                [products]="products()"
                [isAdmin]="isAdmin()"
                [isLogged]="isLogged()"
                [productsInCart]="productsInCart()"
                [favourites]="currentUser().favourites ?? []"
                (add)="addToCart($event)"
                (removeCart)="removeFromCart($event)"
                (favourite)="toggleFavourite($event)"
                (stock)="updateStock($event)"
                (isActive)="toggle($event)"
                (removeProduct)="deleteProduct($event)"
              />
              <div
                class="fixed bottom-6 right-6 z-50 bg-white border border-rose-200 text-rose-700 text-xs font-semibold px-4 py-3 rounded-lg shadow-lg max-w-sm transition-all duration-300"
                [class.opacity-0]="!showRemoveError()"
                [class.opacity-100]="showRemoveError()"
                [class.translate-y-2]="!showRemoveError()"
                [class.translate-y-0]="showRemoveError()"
              >
                {{ removeError() }}
              </div>
            }
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
  readonly #authService = inject(AuthService);

  #isAdmin = this.#authService.isAdmin;
  #currentUser = this.#authService.currentUser;
  #isLogged = inject(TokenStorageService).isLogged;

  isAdmin = computed(() => this.#isAdmin());
  currentUser = computed(() => this.#currentUser());
  isLogged = computed(() => this.#isLogged());

  readonly route = inject(ActivatedRoute);
  getRouteParams = effect(() => {
    this.route.queryParams.subscribe((params) => {
      if (params['categories']) {
        this.filters.update((filters) => ({
          ...filters,
          categories: [params['categories']],
        }));
      }
    });
  });

  currentPage = signal<number>(1);
  lastPage = this.#productService.lastPage;
  pages = computed(() => Array.from({ length: this.lastPage() }, (_, i) => i + 1));

  filters = signal<ProductFilter>({
    categories: [],
    minPrice: null,
    maxPrice: null,
    searchText: '',
    favouritesOnly: false,
  });

  cartResource = this.isLogged() ? this.#transactionService.myCart() : undefined;
  cart = this.isLogged() ? this.#transactionService.cart : undefined;

  productsInCart = computed(() => {
    if (!this.cart) return [];
    return this.cart().transactionsItems.map((item) => item.product);
  });

  readonly #products = this.#productService.models;
  products = computed(() => this.#products());
  productsResource = this.#productService.loadPaginated(
    this.currentPage,
    this.#productService.buildParams(this.filters),
  );

  productToAddToCart = signal<CartItem>(this.#transactionService.defaultCartItem);
  productToRemoveFromCart = signal<CartItem>(this.#transactionService.defaultCartItem);
  productFavourite = signal<Product>(this.#productService.defaultModel);

  productToUpdateStock = signal<CartItem>(this.#productService.defaultCartItem);
  productToRemove = signal<Product>(this.#productService.defaultModel);
  productToToggle = signal<Product>(this.#productService.defaultModel);

  addToCartResource = this.#transactionService.addItem(this.productToAddToCart);
  removeFromCartResource = this.#transactionService.removeItem(this.productToRemoveFromCart);
  favouriteResource = this.#productService.favourite(this.productFavourite);

  updateFavourites = effect(() => {
    if (this.favouriteResource.status() === 'resolved') {
      this.#authService.updateFavourites(this.productFavourite());
    }
  });

  updateStockResource = this.#productService.updateStock(this.productToUpdateStock);
  removeProductResource = this.#productService.remove(this.productToRemove);
  toggleProductResource = this.#productService.toggle(this.productToToggle);

  showRemoveError = signal(false);

  removeErrorEffect = effect(() => {
    const error = this.removeProductResource.error();
    if (!error) return;

    this.showRemoveError.set(true);
    setTimeout(() => this.showRemoveError.set(false), 5000);
  });

  removeError = computed(() => {
    const error = this.removeProductResource.error();
    if (!error) return null;
    if (error instanceof HttpErrorResponse) {
      return error.status === 409 ? error.error.message : 'Error al eliminar el producto';
    }
    return 'Error al eliminar el producto';
  });

  addToCart(product: Product) {
    this.productToAddToCart.set({ product: product, quantity: 1 });
  }

  removeFromCart(product: Product) {
    this.productToRemoveFromCart.set({
      product: product,
      quantity: this.getProductQuantity(product),
    });
  }

  toggleFavourite(product: Product) {
    this.productFavourite.set(product);
  }

  updateStock(cartItem: CartItem) {
    this.productToUpdateStock.set(cartItem);
  }

  deleteProduct(product: Product) {
    this.productToRemove.set(product);
  }

  toggle(product: Product) {
    this.productToToggle.set(product);
  }

  onFiltersChanged(filters: ProductFilter) {
    this.filters.set(filters);
    this.currentPage.set(1);
  }

  getProductQuantity(product: Product): number {
    if (!this.cart) return 0;
    return (
      this.cart().transactionsItems.find(
        (transactionItem) => (transactionItem.product.id = product.id),
      )?.quantity ?? 1
    );
  }
}
