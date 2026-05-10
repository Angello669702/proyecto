import { Component, computed, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { PriceGroup } from '../../interfaces/price-group.interface';
import { User } from '../../../auth/interfaces/user.interface';

@Component({
  selector: 'app-add-user',
  imports: [FormsModule, NgSelectModule],
  templateUrl: './add-user.component.html',
})
export class AddUserComponent {
  priceGroup = input.required<PriceGroup>();
  users = input.required<User[]>();

  selectedUser = signal<User | null>(null);

  addUser = output<{ priceGroup: PriceGroup; user: User }>();

  availableUsers = computed(() => {
    const assignedIds = new Set(this.priceGroup().users?.map((u) => u.id) ?? []);
    return this.users().filter(
      (user) => !assignedIds.has(user.id) && user.role !== 'admin' && !user.priceGroup,
    );
  });

  sendAddUser() {
    const user = this.selectedUser();
    if (!user) return;
    this.addUser.emit({ priceGroup: this.priceGroup(), user });
    this.selectedUser.set(null);
  }
}
