import { inject, Injectable } from '@angular/core';

import { CommonCrudService } from '../../../shared/services/common-crud.service';
import { TransactionDto } from '../dtos/transaction.dto';
import { Transaction } from '../interfaces/transaction.interface';
import { TransactionMapper } from '../mappers/transaction.mapper';

@Injectable({ providedIn: 'root' })
export class TransactionService extends CommonCrudService<Transaction, TransactionDto> {
  readonly API_ENDPOINT = '';
  readonly mapper = inject(TransactionMapper);
  readonly defaultModel = { id: '' } as Transaction;
}
