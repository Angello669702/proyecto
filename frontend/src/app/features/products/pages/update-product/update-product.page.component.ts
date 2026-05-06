import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ProductFormComponent } from '../../components/product-form/product-form.component';
import { ProductService } from '../../services/product.service';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { Product } from '../../interfaces/product.interface';

@Component({
  selector: 'app-product-create',
  imports: [ProductFormComponent, LoadingComponent],
  template: `
    <main class="min-h-screen bg-stone-50">
      @if (!product()) {
        <app-loading />
      } @else {
        @if (errorMessage()) {
          <div class="max-w-4xl mx-auto px-6 pt-24 mb-6">
            <div
              class="bg-rose-50 border border-rose-200 text-rose-900 px-4 py-3 rounded-xl flex items-center justify-between shadow-sm"
            >
              <div class="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 text-rose-800"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span class="text-xs font-bold uppercase tracking-widest">{{
                  errorMessage()
                }}</span>
              </div>
              <button
                (click)="errorMessage.set('')"
                class="text-rose-900/50 hover:text-rose-900 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        }

        @if (successMessage()) {
          <div class="max-w-4xl mx-auto px-6 pt-24 mb-6">
            <div
              class="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 rounded-xl flex items-center justify-between shadow-sm"
            >
              <div class="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 text-emerald-800"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span class="text-xs font-bold uppercase tracking-widest">{{
                  successMessage()
                }}</span>
              </div>
              <button
                (click)="successMessage.set('')"
                class="text-emerald-900/50 hover:text-emerald-900 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        }

        <section class="pt-24 pb-12">
          <div class="max-w-4xl mx-auto px-8 mb-8">
            <div class="flex items-end justify-between">
              <div class="flex flex-col gap-2">
                <span
                  class="text-[10px] font-bold tracking-[0.4em] text-rose-900 uppercase bg-rose-50 px-4 py-1.5 rounded-full w-fit"
                >
                  Panel de Administración
                </span>
                <h1 class="font-serif text-3xl font-bold text-stone-900">Nuevo Producto</h1>
              </div>
              <button
                (click)="goBack()"
                class="text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-rose-900 transition-colors flex items-center gap-2 group"
              >
                <span class="group-hover:-translate-x-1 transition-transform">←</span>
                Volver al catálogo
              </button>
            </div>
          </div>

          <app-product-form [product]="product()" (sendForm)="addProduct($event)" />
        </section>
      }
    </main>
  `,
})
export class UpdateProductPageComponent {
  readonly #productService = inject(ProductService);
  readonly #router = inject(Router);

  product = input.required<Product>();

  errorMessage = signal<string>('');
  successMessage = signal<string>('');

  updateProduct = signal<FormData | null>(null);
  updateProductResource = this.#productService.updateFormData(
    this.updateProduct,
    computed(() => this.product().id),
  );

  navigateEffect = effect(() => {
    const status = this.updateProductResource.status();

    if (status === 'resolved') {
      this.successMessage.set('Producto actualizado correctamente. Redirigiendo...');
      setTimeout(() => {
        this.#router.navigate(['/', 'products', 'catalog']);
      }, 1500);
    }

    if (status === 'error') {
      const error = this.updateProductResource.error();
      const errorMsg =
        (error as any)?.message ||
        (error as any)?.error?.message ||
        'Error al actualizar el producto. Inténtalo de nuevo.';
      this.errorMessage.set(errorMsg);
    }
  });

  addProduct(product: FormData) {
    this.errorMessage.set('');
    this.successMessage.set('');
    this.updateProduct.set(product);
  }

  goBack() {
    this.#router.navigate(['/', 'products', 'catalog']);
  }
}
