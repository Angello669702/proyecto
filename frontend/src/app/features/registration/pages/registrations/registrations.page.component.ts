import { Component, computed, effect, inject, signal } from '@angular/core';
import { RegistrationService } from '../../services/registration.service';
import { RegistrationListComponent } from '../../components/registration-list/registration-list.component';
import { RegistrationFiltersComponent } from '../../components/registration-filters/registration-filters.component';
import { RegistrationStatus } from '../../enums/registration-status.enum';
import { Registration } from '../../interfaces/registration.interface';
import { PaginationButtonsComponent } from '../../../../shared/components/pagination-buttons/pagination-buttons.component';

@Component({
  selector: 'app-home',
  imports: [RegistrationListComponent, RegistrationFiltersComponent, PaginationButtonsComponent],
  template: `
    <div class="min-h-screen bg-stone-50 mt-16 flex flex-col">
      <div class="max-w-7xl mx-auto px-4 py-8 flex flex-col gap-6 flex-1 w-full">
        <app-registration-filters (filter)="applyFilters($event)" />

        <app-registration-list
          [registrations]="registrations()"
          (approve)="approve($event)"
          (reject)="reject($event)"
        />
      </div>

      <footer
        class="sticky bottom-0 bg-white/80 backdrop-blur-md border-t border-stone-200 py-4 px-8 z-30"
      >
        <div class="max-w-7xl mx-auto flex justify-center">
          <app-pagination-buttons
            [(currentPage)]="currentPage"
            [lastPage]="lastPage()"
            [pages]="pages()"
          />
        </div>
      </footer>
    </div>
  `,
})
export class RegistrationsPageComponent {
  readonly #registrationService = inject(RegistrationService);

  currentPage = signal<number>(1);
  lastPage = this.#registrationService.lastPage;
  pages = computed(() => Array.from({ length: this.lastPage() }, (_, i) => i + 1));

  filter = signal<RegistrationStatus | 'all'>('all');
  registrations = this.#registrationService.models;
  registrationsResource = this.#registrationService.loadPaginated(
    this.currentPage,
    this.#registrationService.buildParams(this.filter),
  );

  approveRegistration = signal<Registration>(this.#registrationService.defaultModel);
  rejectRegistration = signal<Registration>(this.#registrationService.defaultModel);

  approveResource = this.#registrationService.approve(this.approveRegistration);
  rejectResource = this.#registrationService.reject(this.rejectRegistration);

  applyFilters(filter: RegistrationStatus | 'all') {
    this.filter.set(filter);
  }

  approve(registration: Registration) {
    this.approveRegistration.set(registration);
  }

  reject(registration: Registration) {
    this.rejectRegistration.set(registration);
  }
}
