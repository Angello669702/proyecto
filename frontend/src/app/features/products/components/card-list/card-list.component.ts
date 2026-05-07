import { Component, input, output } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { Product } from '../../interfaces/product.interface';
import { CartItem } from '../../../../shared/interfaces/cart.interface';
import { UUID } from '../../../../shared/types/uuid.type';

@Component({
  selector: 'app-card-list',
  imports: [CardComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-8 h-full">
        @for (product of products(); track product.id) {
          <app-card-product
            class="h-full"
            [product]="product"
            [isAdmin]="isAdmin()"
            [isLogged]="isLogged()"
            [isProductInCart]="isProductInCart(product)"
            [isFavourite]="isFavourite(product)"
            (add)="addToCart($event)"
            (removeCart)="removeFromCart($event)"
            (favourite)="toggleFavourite($event)"
            (isActive)="toggleProduct($event)"
            (removeProduct)="deleteProduct($event)"
            (stock)="updateStock($event)"
          />
        } @empty {
          <div
            class="col-span-full flex flex-col items-center justify-center py-24 border-2 border-dashed border-stone-200 rounded-2xl bg-stone-50/50"
          >
            <span class="text-4xl mb-4">🍷</span>
            <p class="text-stone-500 font-serif italic text-lg text-center px-6">
              Nuestra bodega está descansando. <br />
              <span class="text-sm font-sans not-italic text-stone-400"
                >No se encontraron productos en esta selección.</span
              >
            </p>
          </div>
        }
      </div>
    </div>
  `,
})
export class CardListComponent {
  readonly products = input.required<Product[]>();
  readonly isAdmin = input<boolean>(false);
  readonly isLogged = input<boolean>(false);
  readonly productsInCart = input<Product[]>([]);
  readonly favourites = input<Product[]>([]);

  add = output<Product>();
  removeCart = output<Product>();
  favourite = output<Product>();

  removeProduct = output<Product>();
  isActive = output<Product>();
  stock = output<CartItem>();

  addToCart(product: Product) {
    this.add.emit(product);
  }

  removeFromCart(product: Product) {
    this.removeCart.emit(product);
  }

  toggleFavourite(product: Product) {
    this.favourite.emit(product);
  }

  deleteProduct(product: Product) {
    this.removeProduct.emit(product);
  }

  toggleProduct(product: Product) {
    this.isActive.emit(product);
  }

  updateStock(cartItem: CartItem) {
    this.stock.emit(cartItem);
  }

  isProductInCart(product: Product) {
    return this.productsInCart().some((productInCart) => productInCart.id === product.id);
  }

  isFavourite(product: Product) {
    return this.favourites().some((favouriteProduct) => favouriteProduct.id === product.id);
  }
}
