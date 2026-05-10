import { Component, effect, input, output, signal } from '@angular/core';
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
  initialFilters = input<ProductFilter>();
  filtersChanged = output<ProductFilter>();

  fillFilters = effect(() => {
    if (this.initialFilters()) {
      this.selectedCategories.set(this.initialFilters()!.categories);
      this.favouritesOnly.set(this.initialFilters()!.favouritesOnly ?? false);
    }
  });

  allCategories = Object.values(CategoryEnum);

  selectedCategories = signal<CategoryEnum[]>([]);
  minPrice = signal<number | null>(null);
  maxPrice = signal<number | null>(null);
  searchText = signal<string>('');
  favouritesOnly = signal<boolean>(false);

  isExpanded = signal(false);

  clearFilters() {
    this.selectedCategories.set([]);
    this.minPrice.set(null);
    this.maxPrice.set(null);
    this.searchText.set('');
    this.favouritesOnly.set(false);
    this.applyFilters();
  }

  hasActiveFilters(): boolean {
    return (
      this.selectedCategories().length > 0 ||
      this.minPrice() !== null ||
      this.maxPrice() !== null ||
      this.searchText().trim() !== '' ||
      this.favouritesOnly()
    );
  }

  applyFilters() {
    this.filtersChanged.emit({
      categories: this.selectedCategories(),
      minPrice: this.minPrice(),
      maxPrice: this.maxPrice(),
      searchText: this.searchText(),
      favouritesOnly: this.favouritesOnly(),
    });
  }
}
