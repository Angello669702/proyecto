import { Component, inject, input } from '@angular/core';
import { Category } from '../../interfaces/category.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card-category',
  imports: [],
  templateUrl: './category-card.component.html',
})
export class CategoryCardComponent {
  readonly category = input.required<Category>();
  readonly #router = inject(Router);

  goToCategory() {
    this.#router.navigate(['/', 'products', 'catalog'], {
      queryParams: {
        categories: this.category().name,
      },
    });
  }
}
