import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-table-skeleton',
  standalone: true,
  template: `
    <div class="w-full overflow-x-auto">
      <table class="w-full border-collapse">
        <thead>
          <tr class="border-b border-stone-200">
            @for (col of columnsArray(); track $index) {
              <th class="px-4 py-3">
                <div
                  class="h-2 rounded bg-stone-200 animate-pulse"
                  [style.width]="headerWidth()"
                ></div>
              </th>
            }
          </tr>
        </thead>

        <tbody>
          @for (row of rowsArray(); track $index) {
            <tr class="border-b border-stone-100">
              @for (col of columnsArray(); track $index) {
                <td class="px-4 py-4">
                  <div
                    class="h-4 rounded bg-stone-100 animate-pulse relative overflow-hidden"
                    [style.width]="getRandomWidth($index)"
                  >
                    <div
                      class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_1.5s_infinite]"
                    ></div>
                  </div>
                </td>
              }
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: [
    `
      @keyframes shimmer {
        0% {
          transform: translateX(-100%);
        }
        100% {
          transform: translateX(100%);
        }
      }
    `,
  ],
})
export class TableSkeletonComponent {
  readonly rows = input<number>(8);
  readonly columns = input<number>(6);

  readonly headerWidth = input<string>('60%');

  rowsArray = computed(() => Array.from({ length: this.rows() }));

  columnsArray = computed(() => Array.from({ length: this.columns() }));

  getRandomWidth(index: number): string {
    const widths = ['40%', '55%', '70%', '85%', '60%'];

    return widths[index % widths.length];
  }
}
