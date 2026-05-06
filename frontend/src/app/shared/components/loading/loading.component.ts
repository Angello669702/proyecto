import { Component } from '@angular/core';

@Component({
  selector: 'app-loading',
  standalone: true,
  template: `
    <div class="flex flex-col items-center justify-center py-24 gap-6">
      <div class="relative">
        <div
          class="w-16 h-16 border-4 border-rose-900/20 border-t-rose-900 rounded-full animate-spin"
        ></div>

        <div class="absolute inset-0 rounded-full bg-rose-900/10 blur-xl"></div>
      </div>

      <div class="flex flex-col items-center gap-2">
        <p class="text-sm font-serif text-stone-600 italic">Cargando selección...</p>

        <span class="text-[10px] uppercase tracking-[0.3em] text-stone-400"> Bodega Premium </span>
      </div>
    </div>
  `,
})
export class LoadingComponent {}
