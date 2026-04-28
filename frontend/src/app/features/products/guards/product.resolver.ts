import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';

import { inject, signal } from '@angular/core';
import { Product } from '../interfaces/product.interface';
import { ProductService } from '../services/product.service';

export const productResolver: ResolveFn<Product> = (route: ActivatedRouteSnapshot) =>
  inject(ProductService).findOne(route.paramMap.get('id')!);
