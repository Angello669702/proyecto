import { Injectable } from '@angular/core';
import { Product } from '../interfaces/product.interface';
import { ProductDto } from '../dtos/product.interface.dto';
import { v4 as uuidv4 } from 'uuid';
import { Mapper } from '../../../shared/interfaces/mapper.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductMapper implements Mapper<Product, ProductDto> {
  mapOne(product: ProductDto): Product {
    return {
      id: product.id,
      category: product.category,
      name: product.name,
      sku: product.sku,
      description: product.description ?? '',
      images: product.images ?? [''],
      price: product.price,
      stock: product.stock,
      stockAlertThreshold: product.stock_alert_threshold,
      isActive: product.is_active,
    };
  }

  mapList(products: ProductDto[]): Product[] {
    return products.map((product) => this.mapOne(product));
  }
}
