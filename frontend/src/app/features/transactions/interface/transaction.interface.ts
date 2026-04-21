import { User } from '../../auth/interfaces/user.interface';
import { PaymentStatus } from '../enums/payment-status.enum';
import { TransactionStatus } from '../enums/transaction-status.enum';
import { TransactionItem } from './transaction-item.interface';

export interface Transaction {
  user: User;
  transactionsItems: TransactionItem[];
  status: TransactionStatus;
  subtotal: number;
  discountApplied: number;
  shippingCost: number;
  total: number;
  shippingAddress: string;
  paymentIntentId: string;
  paymentStatus: PaymentStatus;
  notes: string;
}
