import { Component, input, output } from '@angular/core';
import { CategoryCardComponent } from '../category-card/category-card.component';
import { Category } from '../../interfaces/category.interface';

@Component({
  selector: 'app-category-list',
  imports: [CategoryCardComponent],
  template: `
    <section class="max-w-6xl mx-auto px-6 py-10">
      <div class="flex flex-col gap-2 mb-8">
        <h2 class="font-serif text-2xl font-bold text-stone-900">Todas las Categorías</h2>
        <div class="h-1 w-12 bg-rose-900"></div>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        @for (category of categories(); track category.id) {
          <app-card-category [category]="category" />
        } @empty {
          <div
            class="col-span-full flex flex-col items-center justify-center py-20 border border-dashed border-stone-200 rounded-2xl bg-stone-50"
          >
            <span class="text-3xl mb-3">🍷</span>
            <p class="text-stone-500 font-serif italic text-center">
              No hay categorías disponibles
            </p>
          </div>
        }
      </div>
    </section>
  `,
})
export class CategoryListComponent {
  readonly categories = input.required<Category[]>();
}
