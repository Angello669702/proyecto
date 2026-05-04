import { Component, input, output } from '@angular/core';
import { Registration } from '../../interfaces/registration.interface';
import { RegistrationStatus } from '../../enums/registration-status.enum';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-registration-list',
  imports: [DatePipe],
  templateUrl: './registration-list.component.html',
})
export class RegistrationListComponent {
  registrations = input.required<Registration[]>();

  RegistrationStatus = RegistrationStatus;

  approve = output<Registration>();
  reject = output<Registration>();

  sendAprove(registration: Registration) {
    this.approve.emit(registration);
  }

  sendReject(registration: Registration) {
    this.reject.emit(registration);
  }
}
