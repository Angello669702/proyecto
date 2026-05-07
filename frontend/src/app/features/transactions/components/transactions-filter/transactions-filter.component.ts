import { Component, output, signal } from '@angular/core';
import { TransactionStatus } from '../../enums/transaction-status.enum';

@Component({
  selector: 'app-transaction-filters',
  templateUrl: './transactions-filter.component.html',
})
export class TransactionFiltersComponent {
  filter = output<TransactionStatus | 'all'>();
  currentFilter = signal<TransactionStatus | 'all'>('all');
  TransactionStatus = TransactionStatus;

  applyFilter(status: TransactionStatus | 'all') {
    this.currentFilter.set(status);
    this.filter.emit(status);
  }
}
