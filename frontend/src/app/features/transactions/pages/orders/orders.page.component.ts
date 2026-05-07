import { Component, computed, inject, signal } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';

import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { TransactionsTableComponent } from '../../components/transactions-table/transactions-table.component';
import { Transaction } from '../../interfaces/transaction.interface';
import { PaginationButtonsComponent } from '../../../../shared/components/pagination-buttons/pagination-buttons.component';
import { AuthService } from '../../../auth/services/auth.service';
import { TransactionStatus } from '../../enums/transaction-status.enum';

@Component({
  selector: 'app-home',
  imports: [TransactionsTableComponent, LoadingComponent, PaginationButtonsComponent],
  template: `
    <div class="min-h-screen bg-stone-50 flex flex-col pt-16">
      @if (transactionsResource.status() === 'loading') {
        <div class="flex-1 flex items-center justify-center">
          <app-loading />
        </div>
      } @else {
        <div class="border-b border-stone-200 bg-white">
          <div class="max-w-7xl mx-auto px-8 py-6 flex items-end justify-between">
            <div class="flex flex-col gap-2">
              <p class="text-[10px] font-bold tracking-[0.3em] text-stone-400 uppercase">
                {{ isAdmin() ? 'Panel de administración' : 'Mi cuenta' }}
              </p>
              <h1 class="font-serif text-2xl font-bold text-stone-900">
                {{ isAdmin() ? 'Todas las transacciones' : 'Mis pedidos' }}
              </h1>
              <div class="h-0.5 w-10 bg-rose-900"></div>
            </div>
            <span class="text-xs text-stone-400 tabular-nums">
              {{ transactions().length }} resultado{{ transactions().length !== 1 ? 's' : '' }}
            </span>
          </div>
        </div>

        <div class="flex-1 overflow-auto">
          <div class="max-w-7xl mx-auto px-8 py-6">
            <app-transactions-table
              [transactions]="transactions()"
              [isAdmin]="isAdmin()"
              (repeat)="repeatTransaction($event)"
              (statusChange)="onStatusChange($event)"
            />
          </div>
        </div>

        @if (lastPage() > 1) {
          <div class="sticky bottom-0 z-30 bg-white/80 backdrop-blur-md border-t border-stone-200">
            <div class="max-w-7xl mx-auto px-8 py-4 flex justify-center">
              <app-pagination-buttons
                [(currentPage)]="currentPage"
                [lastPage]="lastPage()"
                [pages]="pages()"
              />
            </div>
          </div>
        }
      }
    </div>
  `,
})
export class OrdersPageComponent {
  readonly #transactionService = inject(TransactionService);
  readonly #authService = inject(AuthService);

  #isAdmin = this.#authService.isAdmin;
  isAdmin = computed(() => this.#isAdmin());

  currentPage = signal<number>(1);
  lastPage = this.#transactionService.lastPage;
  pages = computed(() => Array.from({ length: this.lastPage() }, (_, i) => i + 1));

  readonly #transactions = this.#transactionService.models;
  transactions = computed(() => this.#transactions());
  transactionsResource = this.#transactionService.loadPaginated(this.currentPage);

  transactionToRepeat = signal<Transaction>(this.#transactionService.defaultModel);
  repeatTransacionResource = this.#transactionService.repeat(this.transactionToRepeat);

  changeStatus = signal<{ transaction: Transaction; status: TransactionStatus }>({
    transaction: this.#transactionService.defaultModel,
    status: TransactionStatus.DELIVERED,
  });
  changeStatusResource = this.#transactionService.changeStatus(this.changeStatus);

  repeatTransaction(transaction: Transaction) {
    this.transactionToRepeat.set(transaction);
  }

  onStatusChange(transactionStatus: { transaction: Transaction; status: TransactionStatus }) {
    this.changeStatus.set(transactionStatus);
  }
}
