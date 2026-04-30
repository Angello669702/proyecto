import { Component, inject, signal } from '@angular/core';
import { TokenStorageService } from '../../features/auth/services/token.service';
import { CurrencyPipe } from '@angular/common';
import { CategoryService } from '../../features/categories/services/category.service';
import { ProductService } from '../../features/products/services/product.service';
@Component({
  selector: 'app-home',
  imports: [CurrencyPipe],
  template: ` <section class="relative bg-stone-100 border-b border-stone-300 overflow-hidden">
      <div class="max-w-4xl mx-auto px-8 py-20 flex flex-col items-center text-center gap-6">
        <span class="text-[10px] font-mono tracking-widest text-stone-400 uppercase">
          Distribuidora de Bebidas Alcohólicas
        </span>
        <h1 class="text-4xl font-semibold text-stone-800 leading-tight max-w-xl">
          Tu proveedor de confianza en bebidas premium
        </h1>
        <p class="text-stone-500 text-sm max-w-md leading-relaxed">
          Accede a nuestro catálogo exclusivo con precios adaptados a tu empresa. Gestiona tus
          pedidos de forma rápida y sencilla.
        </p>
        <div class="flex gap-3 mt-2">
          <button
            class="h-10 px-6 bg-stone-800 text-white text-xs font-mono tracking-wide rounded hover:bg-stone-700 transition-colors"
          >
            Ver catálogo
          </button>
          <button
            class="h-10 px-6 bg-stone-100 text-stone-700 text-xs font-mono tracking-wide rounded border border-stone-300 hover:bg-stone-200 transition-colors"
          >
            Solicitar acceso
          </button>
        </div>
      </div>
    </section>

    <section class="border-b border-stone-300 bg-white">
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        @for (category of categories(); track category.id) {
          <button
            class="relative flex items-center justify-center h-20 overflow-hidden rounded border border-stone-200 text-xs font-mono tracking-wide text-stone-700 hover:border-stone-300 transition-colors"
          >
            @if (category.image) {
              <div
                class="absolute inset-0 bg-cover bg-center opacity-20"
                [style.backgroundImage]="'url(' + category.image + ')'"
              ></div>
            }

            <!-- overlay para mejorar legibilidad -->
            <div class="absolute inset-0 bg-white/60"></div>

            <!-- contenido -->
            <span class="relative z-10 text-center px-2">
              {{ category.name }}
            </span>
          </button>
        }
      </div>
    </section>

    <section class="bg-stone-50">
      <div class="max-w-4xl mx-auto px-8 py-10">
        <div class="flex items-center justify-between mb-5">
          <p class="text-[10px] font-mono text-stone-400 uppercase tracking-widest">
            — Productos destacados
          </p>
          <button
            class="text-[10px] font-mono text-stone-500 hover:text-stone-800 transition-colors"
          >
            Ver todos →
          </button>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-3 gap-3">
          @for (product of featuredProducts(); track product.id) {
            <div
              class="group relative flex flex-col bg-stone-100 border border-stone-300 rounded overflow-hidden text-xs cursor-pointer hover:border-stone-400 transition-colors"
            >
              <div class="absolute top-1 left-1 z-10">
                <span class="bg-stone-700 text-stone-100 text-[8px] px-1.5 py-0.5 rounded">
                  {{ product.category.name }}
                </span>
              </div>

              <div
                class="h-32 bg-stone-200 border-b border-stone-300 flex items-center justify-center overflow-hidden"
              >
                <img
                  [src]="product.coverImage"
                  [alt]="product.name"
                  class="object-contain h-full w-full p-3"
                />
              </div>

              <div class="flex flex-col gap-1 p-3 flex-1">
                <p class="font-semibold text-stone-800 text-[11px] line-clamp-1">
                  {{ product.name }}
                </p>
                <p class="text-stone-500 text-[10px] line-clamp-2">
                  {{ product.description }}
                </p>
                <p class="font-mono text-stone-800 text-sm font-bold mt-auto pt-2">
                  {{ product.price | currency: 'EUR' : 'symbol' : '1.2-2' : 'es' }}
                </p>
              </div>
            </div>
          }
        </div>
      </div>
    </section>

    @if (!isLogged()) {
      <section class="border-t border-stone-300 bg-stone-800">
        <div
          class="max-w-4xl mx-auto px-8 py-12 flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div class="flex flex-col gap-2">
            <p class="text-stone-100 font-semibold text-lg">¿Eres distribuidor o negocio?</p>
            <p class="text-stone-400 text-sm">
              Solicita acceso para ver precios personalizados y realizar pedidos.
            </p>
          </div>
          <button
            class="shrink-0 h-10 px-8 bg-stone-100 text-stone-800 text-xs font-mono tracking-wide rounded hover:bg-white transition-colors"
          >
            Solicitar acceso
          </button>
        </div>
      </section>
    }`,
})
export class HomePageComponent {
  readonly #tokenStorageservice = inject(TokenStorageService);
  readonly #categoryService = inject(CategoryService);
  readonly #productService = inject(ProductService);

  page = signal(1);

  isLogged = this.#tokenStorageservice.isLogged;

  categories = this.#categoryService.models;
  categoryResource = this.#categoryService.load(this.page);

  featuredProductsResource = this.#productService.loadFeatureProducts();
  featuredProducts = this.featuredProductsResource.value;
}
