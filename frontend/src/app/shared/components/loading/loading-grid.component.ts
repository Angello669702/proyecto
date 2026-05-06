import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-loading-grid',
  standalone: true,
  template: `
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
      @for (item of skeletons(); track $index) {
        <div class="h-40 rounded-2xl bg-stone-100 animate-pulse relative overflow-hidden">
          <div
            class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_1.5s_infinite]"
          ></div>
        </div>
      }
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
export class LoadingGridComponent {
  readonly length = input<number>(8);

  skeletons = computed(() => Array.from({ length: this.length() }));
}
