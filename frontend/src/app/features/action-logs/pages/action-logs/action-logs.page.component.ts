import { Component, computed, inject, signal } from '@angular/core';
import { PaginationButtonsComponent } from '../../../../shared/components/pagination-buttons/pagination-buttons.component';
import { TableSkeletonComponent } from '../../../../shared/components/loading/table-skeleton.component';
import { ActionLogsTableComponent } from '../../components/action-logs-table/action-logs-table.component';
import { ActionLogService } from '../../services/action-log.service';

@Component({
  selector: 'app-action-logs',
  imports: [TableSkeletonComponent, ActionLogsTableComponent, PaginationButtonsComponent],
  template: `
    <div class="min-h-screen bg-stone-50 flex flex-col pt-16">
      <div class="bg-white border-b border-stone-200">
        <div class="max-w-7xl mx-auto px-8 py-8">
          <div class="flex flex-col gap-2">
            <p class="text-[10px] font-bold tracking-[0.3em] text-stone-400 uppercase">
              Panel de administración
            </p>
            <h1 class="font-serif text-3xl font-bold text-stone-900">Registro de Actividad</h1>
            <div class="h-0.5 w-10 bg-rose-900"></div>
          </div>
        </div>
      </div>

      <div class="flex-1">
        <div class="max-w-7xl mx-auto px-8 py-8">
          <div class="flex justify-end mb-4">
            <span
              class="text-[10px] font-bold text-stone-400 uppercase tracking-widest bg-stone-200/50 px-3 py-1 rounded-full"
            >
              {{ actionLogs().length }} registro{{ actionLogs().length !== 1 ? 's' : '' }}
            </span>
          </div>

          <div class="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
            @if (actionLogsResource.isLoading()) {
              <app-table-skeleton [rows]="10" [columns]="4" />
            } @else {
              <app-action-logs-table [actionLogs]="actionLogs()" />
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
export class ActionLogsPageComponent {
  readonly #actionLogService = inject(ActionLogService);

  currentPage = signal<number>(1);
  lastPage = this.#actionLogService.lastPage;
  pages = computed(() => Array.from({ length: this.lastPage() }, (_, i) => i + 1));

  actionLogs = this.#actionLogService.models;
  actionLogsResource = this.#actionLogService.loadPaginated(this.currentPage);
}
