import { Component, inject } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { CategoryListComponent } from '../../components/category-list/category-list.component';
import { LoadingGridComponent } from '../../../../shared/components/loading/loading-grid.component';

@Component({
  selector: 'app-categories',
  imports: [CategoryListComponent, LoadingGridComponent],
  template: ` <div class="pt-20 px-6">
    @if (categoryResource.isLoading()) {
      <app-loading-grid />
    } @else if (categories().length > 0) {
      <app-category-list [categories]="categories()" />
    } @else {
      <div
        class="flex flex-col items-center justify-center py-24 border border-dashed border-stone-200 rounded-2xl bg-stone-50"
      >
        <span class="text-3xl mb-3">🍷</span>
        <p class="text-stone-500 font-serif italic text-center">No hay categorías disponibles</p>
      </div>
    }
  </div>`,
})
export class CategoriesPageComponent {
  readonly #categoryService = inject(CategoryService);

  categories = this.#categoryService.models;
  categoryResource = this.#categoryService.load();
}
