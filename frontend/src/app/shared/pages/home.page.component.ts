import { Component, inject, signal } from '@angular/core';
import { TokenStorageService } from '../../features/auth/services/token.service';
import { CurrencyPipe } from '@angular/common';
import { CategoryService } from '../../features/categories/services/category.service';
import { ProductService } from '../../features/products/services/product.service';
import { PRODUCT_PAGES } from '../../features/products/product.routes';
import { CATEGORY_PAGES } from '../../features/categories/category.routes';
import { REGISTRATION_PAGES } from '../../features/registration/registration.routes';
import { RouterLink } from '@angular/router';
import { CardComponent } from '../../features/products/components/card/card.component';
@Component({
  selector: 'app-home',
  imports: [RouterLink, CardComponent],
  template: `
    <section class="relative bg-stone-50 border-b border-stone-200 overflow-hidden">
      <div
        class="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-rose-50 rounded-full blur-3xl opacity-50"
      ></div>

      <div
        class="max-w-5xl mx-auto px-8 py-24 lg:py-32 flex flex-col items-center text-center gap-8 relative z-10"
      >
        <span
          class="text-[10px] font-bold tracking-[0.4em] text-rose-900 uppercase bg-rose-50 px-4 py-1.5 rounded-full"
        >
          Boutique de Bebidas Premium
        </span>

        <h1
          class="text-4xl lg:text-6xl font-serif font-bold text-stone-900 leading-[1.1] max-w-3xl"
        >
          Tu proveedor de confianza para experiencias exclusivas
        </h1>

        <p class="text-stone-500 text-base lg:text-lg max-w-xl leading-relaxed font-light">
          Accede a un catálogo curado con precios adaptados a tu negocio. Gestiona tus pedidos con
          la agilidad que tu empresa necesita.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 mt-4">
          <button
            [routerLink]="navigation['catalog']"
            class="h-12 px-10 bg-rose-900 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-rose-950 transition-all shadow-lg shadow-rose-900/20 active:scale-95 cursor-pointer"
          >
            Explorar Catálogo
          </button>
          <button
            [routerLink]="navigation['registration']"
            class="h-12 px-10 bg-white text-stone-700 text-xs font-bold uppercase tracking-widest rounded-xl border border-stone-200 hover:bg-stone-50 transition-all active:scale-95 cursor-pointer"
          >
            Solicitar Acceso
          </button>
        </div>
      </div>
    </section>

    <section class="bg-white py-16 border-b border-stone-100">
      <div class="max-w-6xl mx-auto px-8">
        <div class="flex items-end justify-between mb-10">
          <div class="flex flex-col gap-2">
            <h3 class="font-serif text-2xl font-bold text-stone-900">Categorías</h3>
            <div class="h-1 w-12 bg-rose-900"></div>
          </div>
          <button
            [routerLink]="navigation['categories']"
            class="text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-rose-900 transition-colors flex items-center gap-2 group cursor-pointer"
          >
            Ver todas <span class="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          @for (category of categories().slice(0, 4); track category.id) {
            <button
              class="group relative h-32 flex items-center justify-center overflow-hidden rounded-2xl border border-stone-100 bg-stone-50 transition-all hover:shadow-xl cursor-pointer"
            >
              @if (category.image) {
                <img
                  [src]="category.image"
                  class="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-110 transition-transform duration-700"
                />
              }
              <div
                class="absolute inset-0 bg-gradient-to-t from-stone-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
              ></div>
              <span
                class="relative z-10 font-serif text-lg font-bold text-stone-800 group-hover:text-white transition-colors"
              >
                {{ category.name }}
              </span>
            </button>
          }
        </div>
      </div>
    </section>

    <section class="bg-stone-50 py-20">
      <div class="max-w-6xl mx-auto px-8">
        <div class="flex flex-col items-center mb-12">
          <p class="text-[10px] font-bold text-stone-400 uppercase tracking-[0.3em] mb-3">
            — Selección Premium —
          </p>
          <h2 class="font-serif text-3xl font-bold text-stone-900">Productos Destacados</h2>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          @for (product of featuredProducts()?.slice(0, 4); track product.id) {
            <app-card-product [product]="product" [featured]="true" />
          }
        </div>

        <div class="flex justify-center mt-16">
          <button
            [routerLink]="navigation['catalog']"
            class="group flex items-center gap-3 px-8 py-4 border-2 border-stone-200 rounded-full text-xs font-bold uppercase tracking-widest text-stone-600 hover:border-rose-900 hover:text-rose-900 transition-all cursor-pointer"
          >
            Ver catálogo completo
            <span class="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
      </div>
    </section>
  `,
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

  navigation: Record<string, string[]> = {
    catalog: [PRODUCT_PAGES.PRODUCTS, PRODUCT_PAGES.CATALOG],
    categories: [CATEGORY_PAGES.CATEGORY],
    registration: [REGISTRATION_PAGES.REGISTRATION],
  };
}
