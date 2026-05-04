import { Component, output, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RegistrationStatus } from '../../enums/registration-status.enum';

@Component({
  selector: 'app-registration-filters',
  imports: [ReactiveFormsModule],
  templateUrl: './registration-filters.component.html',
})
export class RegistrationFiltersComponent {
  filter = output<RegistrationStatus | 'all'>();
  currentFilter = signal<RegistrationStatus | 'all'>('all');
  RegistrationStatus = RegistrationStatus;

  applyFilter(status: RegistrationStatus | 'all') {
    this.currentFilter.set(status);
    this.filter.emit(status);
  }
}
