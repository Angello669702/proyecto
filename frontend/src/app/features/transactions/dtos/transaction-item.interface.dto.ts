import { UUID } from '../../../shared/types/uuid.type';
import { ProductDto } from '../../products/dtos/product.interface.dto';

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
