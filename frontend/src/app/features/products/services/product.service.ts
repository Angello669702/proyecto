import { inject, Injectable } from '@angular/core';

import { Product } from '../interfaces/product.interface';
import { ProductDto } from '../dtos/product.interface.dto';
import { ProductMapper } from '../mappers/product.mapper';
import { CommonCrudService } from '../../../shared/services/common-crud.service';

@Injectable({ providedIn: 'root' })
export class ProductService extends CommonCrudService<ProductDto, Product> {
  readonly API_ENDPOINT = '';
  readonly mapper = inject(ProductMapper);
  readonly defaultModel = { id: '' } as Product;
}
