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
    <div class="flex h-[calc(100vh-4rem)] overflow-hidden">
      <aside class="w-64 border-r border-stone-300 p-4">
        <app-product-filter (filtersChanged)="onFiltersChanged($event)" />
      </aside>

      <div class="flex-1 flex flex-col min-h-0">
        <div class="flex-1 p-4 overflow-hidden flex min-h-0">
          <app-card-list
            class="flex-1"
            [products]="products()"
            [isAdmin]="isAdmin()"
            (add)="addToCart($event)"
            (removeCart)="removeFromCart($event)"
            (stock)="updateStock($event)"
            (isActive)="toggle($event)"
            (removeProduct)="deleteProduct($event)"
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

  readonly products = this.#productService.models;
  productsResource = this.#productService.load(
    this.currentPage,
    this.#productService.buildParams(this.filters, this.isAdmin),
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
