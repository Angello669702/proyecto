import { Component, input, output } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { Product } from '../../interfaces/product.interface';
import { CartItem } from '../../../../shared/interfaces/cart.interface';

@Component({
  selector: 'app-card-list',
  imports: [CardComponent],
  template: `
    <div class="flex flex-col h-full">
      <div class="grid grid-cols-2 lg:grid-cols-3 gap-3 h-full">
        @for (product of products(); track product.id) {
          <app-card-product
            [product]="product"
            (add)="addToCart($event)"
            (removeCart)="removeFromCart($event)"
            (isActive)="toggleProduct($event)"
            (removeProduct)="deleteProduct($event)"
            (stock)="updateStock($event)"
          />
        } @empty {
          <p class="col-span-full text-center text-stone-400 text-sm py-12">
            No se encontraron productos.
          </p>
        }
      </div>
    </div>
  `,
})
export class CardListComponent {
  readonly products = input.required<Product[]>();

  add = output<Product>();
  removeCart = output<Product>();

  removeProduct = output<Product>();
  isActive = output<Product>();
  stock = output<CartItem>();

  addToCart(product: Product) {
    this.add.emit(product);
  }

  removeFromCart(product: Product) {
    this.removeCart.emit(product);
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
}
