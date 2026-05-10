import { Component, computed, effect, inject, signal } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';

import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { TransactionsTableComponent } from '../../components/transactions-table/transactions-table.component';
import { Transaction } from '../../interfaces/transaction.interface';
import { PaginationButtonsComponent } from '../../../../shared/components/pagination-buttons/pagination-buttons.component';
import { AuthService } from '../../../auth/services/auth.service';
import { TransactionStatus } from '../../enums/transaction-status.enum';
import { Router } from '@angular/router';
import { TransactionFiltersComponent } from '../../components/transactions-filter/transactions-filter.component';
import { TableSkeletonComponent } from '../../../../shared/components/loading/table-skeleton.component';
import { AlertService } from '../../../../shared/services/alert.service';

@Component({
  selector: 'app-home',
  imports: [
    TransactionsTableComponent,
    PaginationButtonsComponent,
    TransactionFiltersComponent,
    TableSkeletonComponent,
  ],
  template: `
    <div class="min-h-screen bg-stone-50 flex flex-col pt-16">
      <div class="bg-white border-b border-stone-200">
        <div class="max-w-7xl mx-auto px-8 py-8">
          <div class="flex flex-col gap-2">
            <p class="text-[10px] font-bold tracking-[0.3em] text-stone-400 uppercase">
              {{ isAdmin() ? 'Panel de administración' : 'Mi cuenta' }}
            </p>
            <h1 class="font-serif text-3xl font-bold text-stone-900">
              {{ isAdmin() ? 'Todas las transacciones' : 'Mis pedidos' }}
            </h1>
            <div class="h-0.5 w-10 bg-rose-900"></div>
          </div>
        </div>
      </div>

      <div class="flex-1">
        <div class="max-w-7xl mx-auto px-8 py-8">
          <div class="relative mb-2">
            <app-transaction-filters (filter)="applyFilters($event)" />

            <div class="flex justify-end -mt-6 mb-4">
              <span
                class="text-[10px] font-bold text-stone-400 uppercase tracking-widest bg-stone-200/50 px-3 py-1 rounded-full"
              >
                {{ transactions().length }} resultado{{ transactions().length !== 1 ? 's' : '' }}
              </span>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
            @if (transactionsResource.isLoading()) {
              <app-table-skeleton [rows]="10" [columns]="11" />
            } @else {
              <app-transactions-table
                [transactions]="transactions()"
                [isAdmin]="isAdmin()"
                (repeat)="repeatTransaction($event)"
                (statusChange)="onStatusChange($event)"
              />
            }
          </div>
        </div>
      </div>

      @if (lastPage() > 1) {
        <div class="sticky bottom-0 z-30 bg-white/90 backdrop-blur-md border-t border-stone-200">
          <div class="max-w-7xl mx-auto px-8 py-4 flex justify-center">
            <app-pagination-buttons
              [(currentPage)]="currentPage"
              [lastPage]="lastPage()"
              [pages]="pages()"
            />
          </div>
        </div>
      }
    </div>
  `,
})
export class OrdersPageComponent {
  readonly #transactionService = inject(TransactionService);
  readonly #authService = inject(AuthService);
  readonly #alertService = inject(AlertService);
  readonly #router = inject(Router);

  #isAdmin = this.#authService.isAdmin;
  isAdmin = computed(() => this.#isAdmin());

  currentPage = signal<number>(1);
  lastPage = this.#transactionService.lastPage;
  pages = computed(() => Array.from({ length: this.lastPage() }, (_, i) => i + 1));

  filter = signal<TransactionStatus | 'all'>('all');

  readonly #transactions = this.#transactionService.models;
  transactions = computed(() => this.#transactions());
  transactionsResource = this.#transactionService.loadPaginated(
    this.currentPage,
    this.#transactionService.buildParams(this.filter),
  );

  transactionToRepeat = signal<Transaction>(this.#transactionService.defaultModel);
  repeatTransacionResource = this.#transactionService.repeat(this.transactionToRepeat);

  changeStatus = signal<{ transaction: Transaction; status: TransactionStatus }>({
    transaction: this.#transactionService.defaultModel,
    status: TransactionStatus.DELIVERED,
  });
  changeStatusResource = this.#transactionService.changeStatus(this.changeStatus);

  navigateEffect = effect(() => {
    const status = this.repeatTransacionResource.status();

    if (status === 'resolved') {
      this.#alertService.success('Pedido añadido nuevamente al carrito');

      setTimeout(() => {
        this.#router.navigate(['/', 'transactions', 'cart']);
      }, 800);
    }

    if (status === 'error') {
      this.#alertService.error('No se pudo repetir el pedido');
    }
  });

  repeatTransaction(transaction: Transaction) {
    this.transactionToRepeat.set(transaction);
  }

  onStatusChange(transactionStatus: { transaction: Transaction; status: TransactionStatus }) {
    this.changeStatus.set(transactionStatus);
  }

  applyFilters(filter: TransactionStatus | 'all') {
    this.filter.set(filter);
  }
}
