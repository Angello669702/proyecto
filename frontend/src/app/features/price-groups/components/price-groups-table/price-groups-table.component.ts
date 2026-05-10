import { Component, input, output, signal } from '@angular/core';
import { PriceGroup } from '../../interfaces/price-group.interface';
import { PriceGroupItem } from '../../interfaces/price-group-item.interface';
import { User } from '../../../auth/interfaces/user.interface';
import { Product } from '../../../products/interfaces/product.interface';
import { AddUserComponent } from '../add-user/add-user.component';
import { AddItemComponent } from '../add-item/add-item.component';
import { CurrencyPipe } from '@angular/common';

type OpenPanel = 'items' | 'users' | 'add-item' | 'add-user' | null;

@Component({
  selector: 'app-price-groups-table',
  imports: [AddUserComponent, AddItemComponent, CurrencyPipe],
  templateUrl: './price-groups-table.component.html',
})
export class PriceGroupsTableComponent {
  priceGroups = input.required<PriceGroup[]>();
  products = input.required<Product[]>();
  users = input.required<User[]>();

  removeItem = output<{ priceGroup: PriceGroup; item: PriceGroupItem }>();
  removeUser = output<{ priceGroup: PriceGroup; user: User }>();
  addUser = output<{ priceGroup: PriceGroup; user: User }>();
  addItem = output<{ priceGroup: PriceGroup; item: { product: Product; price: number } }>();

  activeGroupId = signal<string | null>(null);
  activePanel = signal<OpenPanel>(null);

  togglePanel(groupId: string, panel: OpenPanel) {
    if (this.activeGroupId() === groupId && this.activePanel() === panel) {
      this.activeGroupId.set(null);
      this.activePanel.set(null);
    } else {
      this.activeGroupId.set(groupId);
      this.activePanel.set(panel);
    }
  }

  isOpen(groupId: string, panel: OpenPanel): boolean {
    return this.activeGroupId() === groupId && this.activePanel() === panel;
  }

  sendRemoveItem(priceGroup: PriceGroup, item: PriceGroupItem) {
    this.removeItem.emit({ priceGroup, item });
  }

  sendRemoveUser(priceGroup: PriceGroup, user: User) {
    this.removeUser.emit({ priceGroup, user });
  }

  sendAddUser(payload: { priceGroup: PriceGroup; user: User }) {
    this.addUser.emit(payload);
    this.activePanel.set(null);
    this.activeGroupId.set(null);
  }

  sendAddItem(payload: { priceGroup: PriceGroup; item: { product: Product; price: number } }) {
    this.addItem.emit(payload);
    this.activePanel.set(null);
    this.activeGroupId.set(null);
  }
}
