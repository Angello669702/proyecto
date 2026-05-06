import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product } from '../../interfaces/product.interface';
import { CategoryEnum } from '../../enums/category.enum';

@Component({
  selector: 'app-product-form',
  imports: [ReactiveFormsModule],
  templateUrl: './product-form.component.html',
})
export class ProductFormComponent {
  readonly #formBuilder = inject(FormBuilder);

  product = input<Product>();
  sendForm = output<FormData>();

  categories = Object.values(CategoryEnum);

  #selectedCoverFile = signal<File | null>(null);
  coverPreviewUrl = signal<string | null>(null);

  #selectedImageFiles = signal<File[]>([]);
  imagePreviews = signal<string[]>([]);

  message = signal<string>('');

  public productForm: FormGroup = this.#formBuilder.group({
    category: ['', [Validators.required]],
    name: ['', [Validators.required]],
    sku: ['', [Validators.required]],
    price: ['', [Validators.required, Validators.min(0)]],
    description: [''],
    stock: ['', [Validators.required, Validators.min(0)]],
  });

  fillForm = effect(() => {
    const product = this.product();
    if (!product) return;
    this.productForm.patchValue({
      category: product.category.name,
      name: product.name,
      sku: product.sku,
      price: product.price,
      description: product.description,
      stock: product.stock,
    });

    if (product.coverImage) {
      this.coverPreviewUrl.set(product.coverImage);
    }
    if (product.images?.length) {
      this.imagePreviews.set(product.images);
    }
  });

  onCoverFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.message.set('Por favor, selecciona un archivo de imagen válido para la portada.');
      return;
    }

    this.#selectedCoverFile.set(file);
    this.coverPreviewUrl.set(URL.createObjectURL(file));
    this.message.set('');
  }

  onImagesSelected(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (!files?.length) return;

    const validFiles: File[] = [];
    const validPreviews: string[] = [];
    let invalidCount = 0;

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        validFiles.push(file);
        validPreviews.push(URL.createObjectURL(file));
      } else {
        invalidCount++;
      }
    });

    if (invalidCount > 0) {
      this.message.set(`${invalidCount} archivo(s) no son imágenes válidas y fueron ignorados.`);
    } else {
      this.message.set('');
    }

    this.#selectedImageFiles.update((prev) => [...prev, ...validFiles]);
    this.imagePreviews.update((prev) => [...prev, ...validPreviews]);
  }

  removeImage(index: number) {
    this.#selectedImageFiles.update((files) => files.filter((_, i) => i !== index));
    this.imagePreviews.update((previews) => {
      const removed = previews[index];
      if (removed?.startsWith('blob:')) {
        URL.revokeObjectURL(removed);
      }
      return previews.filter((_, i) => i !== index);
    });
  }

  removeCover() {
    this.#selectedCoverFile.set(null);
    const current = this.coverPreviewUrl();
    if (current?.startsWith('blob:')) {
      URL.revokeObjectURL(current);
    }
    this.coverPreviewUrl.set(null);
  }

  sendProductForm() {
    this.productForm.markAllAsTouched();

    if (this.productForm.invalid) {
      this.message.set('Por favor corrige los errores del formulario.');
      return;
    }

    if (!this.#selectedCoverFile() && !this.coverPreviewUrl()) {
      this.message.set('La imagen de portada es requerida.');
      return;
    }

    const formData = new FormData();
    const values = this.productForm.value;

    formData.append('category', values.category);
    formData.append('name', values.name);
    formData.append('sku', values.sku);
    formData.append('price', values.price.toString());
    formData.append('description', values.description ?? '');
    formData.append('stock', values.stock.toString());

    const coverFile = this.#selectedCoverFile();
    if (coverFile) {
      formData.append('cover_image', coverFile);
    }

    for (const file of this.#selectedImageFiles()) {
      formData.append('images[]', file);
    }

    this.sendForm.emit(formData);
  }
}
