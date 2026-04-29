import { Component, output, signal } from '@angular/core';
import { Category } from '../../../categories/interfaces/category.interface';
import { ProductFilter } from '../../interfaces/product-filter.interface';
import { CategoryEnum } from '../../enums/category.enum';
import { FormsModule } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
  selector: 'app-product-filter',
  imports: [NgSelectComponent, FormsModule],
  templateUrl: './product-filter.component.html',
  styleUrl: './product-filter.component.css',
})
export class ProductFilterComponent {
  filtersChanged = output<ProductFilter>();

  allCategories = Object.values(CategoryEnum);

  selectedCategories = signal<CategoryEnum[]>([]);
  minPrice = signal<number | null>(null);
  maxPrice = signal<number | null>(null);
  searchText = signal<string>('');

  isExpanded = signal(false);

  clearFilters() {
    this.selectedCategories.set([]);
    this.minPrice.set(null);
    this.maxPrice.set(null);
    this.searchText.set('');
    this.applyFilters();
  }

  hasActiveFilters(): boolean {
    return (
      this.selectedCategories().length > 0 ||
      this.minPrice() !== null ||
      this.maxPrice() !== null ||
      this.searchText().trim() !== ''
    );
  }

  applyFilters() {
    this.filtersChanged.emit({
      categories: this.selectedCategories(),
      minPrice: this.minPrice(),
      maxPrice: this.maxPrice(),
      searchText: this.searchText(),
    });
  }
}
