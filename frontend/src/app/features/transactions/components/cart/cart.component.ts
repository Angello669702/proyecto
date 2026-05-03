import { Component, input, output } from '@angular/core';
import { Transaction } from '../../interfaces/transaction.interface';
import { CartItem } from '../../../../shared/interfaces/cart.interface';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  transaction = input.required<Transaction>();

  remove = output<CartItem>();
  add = output<CartItem>();
  repeat = output<Transaction>();

  removeItem(cartItem: CartItem) {
    this.remove.emit(cartItem);
  }

  addItem(cartItem: CartItem) {
    this.add.emit(cartItem);
  }

  repeatTransaction() {
    this.repeat.emit(this.transaction());
  }
}
