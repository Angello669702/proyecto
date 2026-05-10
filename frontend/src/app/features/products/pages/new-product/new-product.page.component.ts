import { Component, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ProductFormComponent } from '../../components/product-form/product-form.component';
import { ProductService } from '../../services/product.service';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { AlertService } from '../../../../shared/services/alert.service';

@Component({
  selector: 'app-new-product',
  imports: [ProductFormComponent],
  template: `
    <main class="min-h-screen bg-stone-50">
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

        <app-product-form (sendForm)="addProduct($event)" />
      </section>
    </main>
  `,
})
export class NewProductPageComponent {
  readonly #productService = inject(ProductService);
  readonly #alertService = inject(AlertService);
  readonly #router = inject(Router);

  newProduct = signal<FormData | null>(null);
  newProductResource = this.#productService.addFormData(this.newProduct);

  navigateEffect = effect(() => {
    const status = this.newProductResource.status();

    if (status === 'resolved') {
      this.#alertService.success('Producto creado correctamente');

      setTimeout(() => {
        this.#router.navigate(['/', 'products', 'catalog']);
      }, 800);
    }

    if (status === 'error') {
      const error = this.newProductResource.error();

      const errorMsg =
        (error as any)?.message || (error as any)?.error?.message || 'Error al crear el producto';

      this.#alertService.modalError('Error al crear producto', errorMsg);
    }
  });

  addProduct(product: FormData) {
    this.newProduct.set(product);
  }

  goBack() {
    this.#router.navigate(['/', 'products', 'catalog']);
  }
}
