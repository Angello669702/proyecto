import { Component, computed, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../../products/services/product.service';
import { UserService } from '../../../auth/services/user.service';
import { Product } from '../../../products/interfaces/product.interface';
import { PriceGroupService } from '../../services/price-group.service';
import { PriceGroupItem } from '../../interfaces/price-group-item.interface';
import { PriceGroup } from '../../interfaces/price-group.interface';
import { User } from '../../../auth/interfaces/user.interface';
import { PriceGroupsTableComponent } from '../../components/price-groups-table/price-groups-table.component';
import { PaginationButtonsComponent } from '../../../../shared/components/pagination-buttons/pagination-buttons.component';
import { TableSkeletonComponent } from '../../../../shared/components/loading/table-skeleton.component';
import { PRICE_GROUPS_PAGES } from '../../price-groups.routes';
import { AlertService } from '../../../../shared/services/alert.service';

@Component({
  selector: 'app-price-groups',
  imports: [PriceGroupsTableComponent, PaginationButtonsComponent, TableSkeletonComponent],
  template: `
    <div class="min-h-screen bg-stone-50 flex flex-col pt-16">
      <div class="bg-white border-b border-stone-200">
        <div class="max-w-7xl mx-auto px-8 py-8 flex items-end justify-between">
          <div class="flex flex-col gap-2">
            <p class="text-[10px] font-bold tracking-[0.3em] text-stone-400 uppercase">
              Panel de administración
            </p>
            <h1 class="font-serif text-3xl font-bold text-stone-900">Grupos de precios</h1>
            <div class="h-0.5 w-10 bg-rose-900"></div>
          </div>

          <button
            (click)="navigateToNew()"
            class="h-11 px-8 bg-rose-900 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-rose-950 transition-all shadow-lg shadow-rose-900/20 active:scale-95 cursor-pointer"
          >
            + Nuevo grupo
          </button>
        </div>
      </div>

      <div class="flex-1">
        <div class="max-w-7xl mx-auto px-8 py-8">
          <div class="flex justify-end mb-4">
            <span
              class="text-[10px] font-bold text-stone-400 uppercase tracking-widest bg-stone-200/50 px-3 py-1 rounded-full"
            >
              {{ priceGroups().length }} grupo{{ priceGroups().length !== 1 ? 's' : '' }}
            </span>
          </div>

          <div class="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
            @if (priceGroupsResource.isLoading()) {
              <app-table-skeleton [rows]="8" [columns]="4" />
            } @else {
              <app-price-groups-table
                [priceGroups]="priceGroups()"
                [products]="products()"
                [users]="users()"
                (removeItem)="onRemoveItem($event)"
                (removeUser)="onRemoveUser($event)"
                (addUser)="onAddUser($event)"
                (addItem)="onAddItem($event)"
              />
            }
          </div>
        </div>
      </div>

      @if (lastPage() > 1) {
        <div class="sticky bottom-0 z-30 bg-white/90 backdrop-blur-md border-t border-stone-200">
          <div class="max-w-7xl mx-auto px-8 py-4 flex justify-center">
            <app-pagination-buttons
              [(currentPage)]="currentPage"
              [lastPage]="lastPage()"
              [pages]="pages()"
            />
          </div>
        </div>
      }
    </div>
  `,
})
export class PriceGroupsPageComponent {
  readonly #router = inject(Router);
  readonly #productService = inject(ProductService);
  readonly #priceGroupService = inject(PriceGroupService);
  readonly #userService = inject(UserService);
  readonly #alertService = inject(AlertService);

  currentPage = signal<number>(1);
  lastPage = this.#priceGroupService.lastPage;
  pages = computed(() => Array.from({ length: this.lastPage() }, (_, i) => i + 1));

  products = this.#productService.models;
  productsResource = this.#productService.loadAll();

  users = this.#userService.models;
  usersResource = this.#userService.loadAll();

  priceGroups = this.#priceGroupService.models;
  priceGroupsResource = this.#priceGroupService.loadPaginated(this.currentPage);

  itemToRemove = signal<{ priceGroup: PriceGroup; item: PriceGroupItem } | undefined>(undefined);
  userToRemove = signal<{ priceGroup: PriceGroup; user: User } | undefined>(undefined);
  userToAdd = signal<{ priceGroup: PriceGroup; user: User } | undefined>(undefined);
  itemToAdd = signal<
    { priceGroup: PriceGroup; item: { product: Product; price: number } } | undefined
  >(undefined);

  itemToRemoveResource = this.#priceGroupService.removeItem(this.itemToRemove);
  userToRemoveResource = this.#priceGroupService.removeUser(this.userToRemove);
  userToAddResource = this.#priceGroupService.addUser(this.userToAdd);
  itemToAddResource = this.#priceGroupService.addItem(this.itemToAdd);

  removeItemEffect = effect(() => {
    const status = this.itemToRemoveResource.status();
    const payload = this.itemToRemove();

    if (status === 'resolved') {
      this.#alertService.success(`${payload?.item.product.name} eliminado del grupo`);

      this.priceGroupsResource.reload();
    }

    if (status === 'error') {
      this.#alertService.error('No se pudo eliminar el producto');
    }
  });

  removeUserEffect = effect(() => {
    const status = this.userToRemoveResource.status();
    const payload = this.userToRemove();

    if (status === 'resolved') {
      this.#alertService.success(`${payload?.user.name} eliminado del grupo`);

      this.priceGroupsResource.reload();
    }

    if (status === 'error') {
      this.#alertService.error('No se pudo eliminar el usuario');
    }
  });

  addUserEffect = effect(() => {
    const status = this.userToAddResource.status();
    const payload = this.userToAdd();

    if (status === 'resolved') {
      this.#alertService.success(`${payload?.user.name} añadido al grupo`);

      this.priceGroupsResource.reload();
    }

    if (status === 'error') {
      this.#alertService.error('No se pudo añadir el usuario');
    }
  });

  addItemEffect = effect(() => {
    const status = this.itemToAddResource.status();
    const payload = this.itemToAdd();

    if (status === 'resolved') {
      this.#alertService.success(`${payload?.item.product.name} añadido al grupo`);

      this.priceGroupsResource.reload();
    }

    if (status === 'error') {
      this.#alertService.error('No se pudo añadir el producto');
    }
  });

  navigateToNew() {
    this.#router.navigate(['price-groups', PRICE_GROUPS_PAGES.NEW]);
  }

  onRemoveItem(payload: { priceGroup: PriceGroup; item: PriceGroupItem }) {
    this.itemToRemove.set(payload);
  }

  onRemoveUser(payload: { priceGroup: PriceGroup; user: User }) {
    this.userToRemove.set(payload);
  }

  onAddUser(payload: { priceGroup: PriceGroup; user: User }) {
    this.userToAdd.set(payload);
  }

  onAddItem(payload: { priceGroup: PriceGroup; item: { product: Product; price: number } }) {
    this.itemToAdd.set(payload);
  }
}
