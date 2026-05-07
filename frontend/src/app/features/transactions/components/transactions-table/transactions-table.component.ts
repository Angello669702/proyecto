import { Component, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, NgClass } from '@angular/common';
import { Transaction } from '../../interfaces/transaction.interface';
import { TransactionStatus } from '../../enums/transaction-status.enum';
import { PaymentStatus } from '../../enums/payment-status.enum';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-transactions-table',
  imports: [RouterLink, CurrencyPipe, NgClass, NgSelectModule, FormsModule],
  templateUrl: './transactions-table.component.html',
})
export class TransactionsTableComponent {
  transactions = input.required<Transaction[]>();
  isAdmin = input<boolean>(false);
  loading = input<boolean>(false);
  repeat = output<Transaction>();
  statusChange = output<{ transaction: Transaction; status: TransactionStatus }>();

  allStatuses = Object.values(TransactionStatus);

  cartRoute = ['/', 'transactions', 'cart'];

  expandedRow = signal<string | null>(null);

  toggleRow(id: string): void {
    this.expandedRow.update((current) => (current === id ? null : id));
  }

  repeatTransaction(transaction: Transaction): void {
    this.repeat.emit(transaction);
  }

  onStatusChange(transaction: Transaction, status: TransactionStatus): void {
    if (status) this.statusChange.emit({ transaction, status });
  }

  getStatusLabel(status: TransactionStatus): string {
    const labels: Record<TransactionStatus, string> = {
      [TransactionStatus.PENDING]: 'Pendiente',
      [TransactionStatus.PREPARING]: 'Preparando',
      [TransactionStatus.SHIPPED]: 'Enviado',
      [TransactionStatus.DELIVERED]: 'Entregado',
      [TransactionStatus.CANCELLED]: 'Cancelado',
    };
    return labels[status] ?? status;
  }

  getStatusClasses(status: TransactionStatus): string {
    const map: Record<TransactionStatus, string> = {
      [TransactionStatus.PENDING]: 'bg-amber-50 text-amber-700 border border-amber-200',
      [TransactionStatus.PREPARING]: 'bg-blue-50 text-blue-700 border border-blue-200',
      [TransactionStatus.SHIPPED]: 'bg-violet-50 text-violet-700 border border-violet-200',
      [TransactionStatus.DELIVERED]: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      [TransactionStatus.CANCELLED]: 'bg-stone-100 text-stone-400 border border-stone-200',
    };
    return map[status] ?? '';
  }

  getStatusDotClasses(status: TransactionStatus): string {
    const map: Record<TransactionStatus, string> = {
      [TransactionStatus.PENDING]: 'bg-amber-400',
      [TransactionStatus.PREPARING]: 'bg-blue-400',
      [TransactionStatus.SHIPPED]: 'bg-violet-400',
      [TransactionStatus.DELIVERED]: 'bg-emerald-400',
      [TransactionStatus.CANCELLED]: 'bg-stone-300',
    };
    return map[status] ?? '';
  }

  getPaymentStatusLabel(status: PaymentStatus): string {
    const labels: Record<string, string> = {
      paid: 'Pagado',
      pending: 'Pendiente',
      failed: 'Fallido',
      refunded: 'Reembolsado',
    };
    return labels[status] ?? status;
  }

  getPaymentStatusClasses(status: PaymentStatus): string {
    const map: Record<string, string> = {
      paid: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      pending: 'bg-amber-50 text-amber-700 border border-amber-200',
      failed: 'bg-rose-50 text-rose-700 border border-rose-200',
      refunded: 'bg-stone-100 text-stone-500 border border-stone-200',
    };
    return map[status] ?? 'bg-stone-100 text-stone-400';
  }
}
