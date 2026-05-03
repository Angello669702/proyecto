import { UUID } from '../../../shared/types/uuid.type';
import { ProductDto } from '../../products/dtos/product.interface.dto';
import { Product } from '../../products/interfaces/product.interface';

export interface TransactionItemDto {
  id: UUID;
  product: ProductDto;
  quantity: number;
  original_price: number;
  unit_price: number;
  discount: number;
  vat_rate: number;
  vat_amount: number;
  subtotal: number;
  subtotal_with_vat: number;
}
