import { Component, inject, signal } from '@angular/core';
import { CardListComponent } from '../components/card-list/card-list.component';
import { AuthService } from '../../auth/services/auth.service';
import { TransactionService } from '../../transactions/services/transaction.service';
import { Product } from '../interfaces/product.interface';

@Component({
  selector: 'app-card-product',
  imports: [CardListComponent],
  template: ` <app-card-list [products]="products()"> </app-card-list> `,
})
export class HomePageComponent {
  products = signal<Product[]>([]);
  readonly #transactionService = inject(TransactionService);
  readonly #currentUser = inject(AuthService).currentUser();

  addToCart(product: Product) {}
}

/*
<div class="flex items-center justify-center gap-1">
    <button
      [disabled]="currentPage() === 1"
      (click)="onPageChange(currentPage() - 1)"
      class="w-8 h-8 font-mono text-sm bg-stone-100 border border-stone-300 rounded-sm hover:bg-stone-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
    >
      «
    </button>

    @for (page of totalPages(); track page) {
      <button
        (click)="onPageChange(page)"
        [class]="page === currentPage()
          ? 'w-8 h-8 font-mono text-sm bg-stone-800 text-stone-100 border border-stone-800 rounded-sm'
          : 'w-8 h-8 font-mono text-sm bg-stone-100 border border-stone-300 rounded-sm hover:bg-stone-200 transition-colors'"
      >
        {{ page }}
      </button>
    }

    <button
      [disabled]="currentPage() === totalPages().length"
      (click)="onPageChange(currentPage() + 1)"
      class="w-8 h-8 font-mono text-sm bg-stone-100 border border-stone-300 rounded-sm hover:bg-stone-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
    >
      »
    </button>
  </div>
*/
