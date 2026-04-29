import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  input,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import { Product } from '../../interfaces/product.interface';
import { CartItem } from '../../../../shared/interfaces/cart.interface';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { register } from 'swiper/element/bundle';
register();
@Component({
  selector: 'app-product-detail',
  imports: [CurrencyPipe, RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
})
export class ProductDetailComponent {
  readonly product = input.required<Product>();
  quantity = signal<number>(0);

  Math = Math;

  add = output<CartItem>();

  addToCart() {
    this.add.emit({ product: this.product(), quantity: this.quantity() });
  }
}
