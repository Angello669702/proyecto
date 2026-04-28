import { Component, input, output, signal } from '@angular/core';
import { Product } from '../../interfaces/product.interface';
import { CartItem } from '../../../../shared/interfaces/cart.interface';

@Component({
  selector: 'app-product-detail',
  imports: [],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
})
export class ProductDetailComponent {
  readonly product = input.required<Product>();
  quantity = signal<number>(0);

  add = output<CartItem>();
  remove = output<CartItem>();

  addToCart() {
    this.add.emit({ product: this.product(), quantity: this.quantity() });
  }

  removeFromCart() {
    this.remove.emit({ product: this.product(), quantity: this.quantity() });
  }
}
