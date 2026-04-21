import { Injectable } from '@angular/core';
import { Product } from '../interfaces/product.interface';
import { ProductDto } from '../dtos/product.dto';

@Injectable({
  providedIn: 'root',
})
export class ProductMapper {
  #map(product: ProductDto): Product {
    return {
      category: product.category,
      name: product.name,
      sku: product.sku,
      description: product.description ?? '',
      image: product.image ?? '',
      price: product.price,
      stock: product.stock,
      stockAlertThreshold: product.stock_alert_threshold,
      isActive: product.is_active,
    };
  }

  map(products: ProductDto[]): Product[] {
    return products.map((product) => this.#map(product));
  }
}
