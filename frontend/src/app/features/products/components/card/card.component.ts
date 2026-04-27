import { Component, inject, input, output } from '@angular/core';
import { Product } from '../../interfaces/product.interface';
import { CurrencyPipe } from '@angular/common';
import { TransactionService } from '../../../transactions/services/transaction.service';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-card-product',
  imports: [CurrencyPipe],
  templateUrl: './card.component.html',
})
export class CardComponent {
  readonly product = input.required<Product>();
  cart = output<Product>();

  addToCart() {
    this.cart.emit(this.product());
  }
}
