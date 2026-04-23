import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';

import { inject, signal } from '@angular/core';
import { Product } from '../interfaces/product.interface';
import { ProductService } from '../services/product.service';

export const prodcutResolver: ResolveFn<Product> = (route: ActivatedRouteSnapshot) =>
  inject(ProductService)
    .find(signal(parseInt(route.paramMap.get('id')!, 10)))
    .value()!;
