import { User } from '../../auth/interfaces/user.interface';
import { PaymentStatus } from '../enums/payment-status.enum';
import { TransactionStatus } from '../enums/transaction-status.enum';
import { TransactionItemDto } from './transaction-item.interface.dto';

export interface TransactionDto {
  user: User;
  transactions_items: TransactionItemDto[];
  status: TransactionStatus;
  subtotal: number;
  discount_applied: number;
  shipping_cost: number;
  total: number;
  shipping_address: string;
  payment_intent_id?: string;
  payment_status: PaymentStatus;
  notes?: string;
}
