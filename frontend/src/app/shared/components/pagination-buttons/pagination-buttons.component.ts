import { Component, input, model } from '@angular/core';

@Component({
  selector: 'app-pagination-buttons',
  imports: [],
  templateUrl: './pagination-buttons.component.html',
})
export class PaginationButtonsComponent {
  currentPage = model<number>(1);
  lastPage = input.required<number>();
  pages = input.required<number[]>();

  goToPage(page: number) {
    this.currentPage.set(page);
  }

  nextPage() {
    this.currentPage.update((page) => page + 1);
  }

  prevPage() {
    this.currentPage.update((page) => page - 1);
  }
}
