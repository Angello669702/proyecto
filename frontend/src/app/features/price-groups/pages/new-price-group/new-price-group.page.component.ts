import { Component, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { PriceGroupService } from '../../services/price-group.service';
import { PriceGroup } from '../../interfaces/price-group.interface';
import { PriceGroupFormComponent } from '../../components/price-group-form/price-group-form.component';
import { FEATURE_PAGES } from '../../../../app.routes';

@Component({
  selector: 'app-new-price-group',
  imports: [PriceGroupFormComponent],
  template: `
    <div class="min-h-screen bg-stone-50 flex flex-col pt-16">
      <div class="bg-white border-b border-stone-200">
        <div class="max-w-3xl mx-auto px-8 py-8">
          <button
            (click)="goBack()"
            class="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-rose-900 transition-colors mb-6 cursor-pointer"
          >
            ← Volver
          </button>
          <div class="flex flex-col gap-2">
            <p class="text-[10px] font-bold tracking-[0.3em] text-stone-400 uppercase">
              Panel de administración
            </p>
            <h1 class="font-serif text-3xl font-bold text-stone-900">Nuevo grupo de precios</h1>
            <div class="h-0.5 w-10 bg-rose-900"></div>
          </div>
        </div>
      </div>

      <div class="flex-1 max-w-3xl mx-auto w-full px-8 py-10">
        <div class="bg-white rounded-xl border border-stone-200 shadow-sm p-8">
          <app-price-group-form (create)="onCreate($event)" />

          @if (createResource.isLoading()) {
            <div class="flex items-center gap-3 mt-6 text-stone-500 text-sm">
              <svg
                class="animate-spin h-4 w-4 text-rose-900"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              Creando grupo...
            </div>
          }

          @if (createResource.error()) {
            <p
              class="mt-6 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3"
            >
              Ha ocurrido un error al crear el grupo. Inténtalo de nuevo.
            </p>
          }
        </div>
      </div>
    </div>
  `,
})
export class NewPriceGroupPageComponent {
  readonly #router = inject(Router);
  readonly #priceGroupService = inject(PriceGroupService);

  groupToCreate = signal<PriceGroup | undefined>(undefined);
  createResource = this.#priceGroupService.add(this.groupToCreate as any);

  navigateEffect = effect(() => {
    if (this.createResource.value()) {
      this.goBack();
    }
  });

  onCreate(priceGroup: PriceGroup) {
    this.groupToCreate.set(priceGroup);
  }

  goBack() {
    this.#router.navigate(['/', FEATURE_PAGES.PRICE_GROUPS]);
  }
}
