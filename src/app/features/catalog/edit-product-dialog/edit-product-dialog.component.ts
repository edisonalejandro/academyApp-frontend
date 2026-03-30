import {
  Component, Input, Output, EventEmitter, OnInit, signal, inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CatalogService } from '../../../core/services/catalog.service';
import { ProductDTO, ProductVariantDTO, ProductCategoryDTO, ProductSize } from '../../../core/models';
import { forkJoin } from 'rxjs';

// Variante local (puede no tener ID si es nueva)
interface VariantRow {
  id?: number;
  size: ProductSize;
  stock: number;
  additionalPrice: number;
  isNew: boolean;
  toDelete: boolean;
}

const SIZE_ORDER: ProductSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'UNICO'];

@Component({
  selector: 'app-edit-product-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-product-dialog.component.html',
  styleUrls: ['./edit-product-dialog.component.css']
})
export class EditProductDialogComponent implements OnInit {

  @Input() product!: ProductDTO;
  @Output() saved  = new EventEmitter<ProductDTO>();
  @Output() closed = new EventEmitter<void>();

  private catalogService = inject(CatalogService);

  // Form fields
  name        = '';
  description = '';
  basePrice   = 0;
  categoryId  = 0;
  featured    = false;

  // Imagen
  imagePreview    = signal<string | null>(null);
  selectedFile    = signal<File | null>(null);
  uploadingImage  = signal(false);

  // Variantes
  variants = signal<VariantRow[]>([]);
  readonly allSizes: ProductSize[] = SIZE_ORDER;

  // Categorías para el selector
  categories = signal<ProductCategoryDTO[]>([]);

  // Estado
  saving    = signal(false);
  errorMsg  = signal<string | null>(null);

  ngOnInit(): void {
    // Rellenar form
    this.name        = this.product.name;
    this.description = this.product.description ?? '';
    this.basePrice   = this.product.basePrice;
    this.categoryId  = this.product.categoryId;
    this.featured    = this.product.featured;
    this.imagePreview.set(this.product.imageUrl ?? null);

    // Construir filas de variantes
    const rows: VariantRow[] = this.product.variants.map(v => ({
      id: v.id,
      size: v.size,
      stock: v.stock,
      additionalPrice: v.additionalPrice,
      isNew: false,
      toDelete: false
    }));
    this.variants.set(rows);

    // Cargar categorías
    this.catalogService.getAllCategories().subscribe({
      next: cats => this.categories.set(cats),
      error: () => {}
    });
  }

  // ---- Imagen ----

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file  = input.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.errorMsg.set('Solo se permiten imágenes (JPG, PNG, WEBP...)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.errorMsg.set('La imagen no debe superar los 5 MB');
      return;
    }

    this.selectedFile.set(file);
    const reader = new FileReader();
    reader.onload = e => this.imagePreview.set(e.target?.result as string);
    reader.readAsDataURL(file);
    this.errorMsg.set(null);
  }

  // ---- Variantes ----

  addVariant(): void {
    const used = this.variants().filter(v => !v.toDelete).map(v => v.size);
    const available = this.allSizes.find(s => !used.includes(s));
    if (!available) {
      this.errorMsg.set('Ya están configuradas todas las tallas disponibles');
      return;
    }
    this.variants.update(rows => [
      ...rows,
      { size: available, stock: 0, additionalPrice: 0, isNew: true, toDelete: false }
    ]);
  }

  markDelete(index: number): void {
    this.variants.update(rows =>
      rows.map((r, i) => i === index ? { ...r, toDelete: true } : r)
    );
  }

  undoDelete(index: number): void {
    this.variants.update(rows =>
      rows.map((r, i) => i === index ? { ...r, toDelete: false } : r)
    );
  }

  visibleVariants(): VariantRow[] {
    return this.variants();
  }

  availableSizesFor(currentSize: ProductSize): ProductSize[] {
    const used = this.variants()
      .filter(v => !v.toDelete && v.size !== currentSize)
      .map(v => v.size);
    return this.allSizes.filter(s => !used.includes(s));
  }

  // ---- Guardar ----

  async save(): Promise<void> {
    this.errorMsg.set(null);

    if (!this.name.trim()) {
      this.errorMsg.set('El nombre del producto es obligatorio');
      return;
    }
    if (this.basePrice <= 0) {
      this.errorMsg.set('El precio debe ser mayor a 0');
      return;
    }

    this.saving.set(true);

    try {
      // 1. Subir imagen si hay una nueva
      if (this.selectedFile()) {
        this.uploadingImage.set(true);
        await this.uploadImage();
        this.uploadingImage.set(false);
      }

      // 2. Actualizar campos del producto
      const updated = await this.updateProductFields();

      // 3. Persistir cambios de variantes
      await this.syncVariants();

      // 4. Recargar el producto para obtener estado final
      this.catalogService.getProductById(this.product.id).subscribe({
        next: fresh => {
          this.saving.set(false);
          this.saved.emit(fresh);
        },
        error: () => {
          this.saving.set(false);
          this.saved.emit(updated);
        }
      });
    } catch (e: any) {
      this.saving.set(false);
      this.uploadingImage.set(false);
      this.errorMsg.set(e?.message ?? 'Error al guardar los cambios');
    }
  }

  private uploadImage(): Promise<void> {
    return new Promise((resolve, reject) => {
      const file = this.selectedFile();
      if (!file) { resolve(); return; }
      this.catalogService.uploadProductImage(this.product.id, file).subscribe({
        next: () => resolve(),
        error: () => reject(new Error('No se pudo subir la imagen'))
      });
    });
  }

  private updateProductFields(): Promise<ProductDTO> {
    return new Promise((resolve, reject) => {
      this.catalogService.updateProduct(this.product.id, {
        name: this.name.trim(),
        description: this.description.trim(),
        basePrice: this.basePrice,
        categoryId: this.categoryId,
        featured: this.featured
      }).subscribe({ next: resolve, error: () => reject(new Error('Error al actualizar el producto')) });
    });
  }

  private async syncVariants(): Promise<void> {
    const rows = this.variants();

    for (const row of rows) {
      if (row.toDelete && row.id) {
        // Eliminar variante existente
        await this.deleteVariantAsync(row.id);
      } else if (!row.toDelete && row.isNew) {
        // Crear nueva variante
        await this.addVariantAsync(row);
      } else if (!row.toDelete && !row.isNew && row.id) {
        // Actualizar existente
        await this.updateVariantAsync(row);
      }
    }
  }

  private deleteVariantAsync(variantId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.catalogService.deleteVariant(this.product.id, variantId)
        .subscribe({ next: () => resolve(), error: () => reject(new Error(`Error eliminando variante ${variantId}`)) });
    });
  }

  private addVariantAsync(row: VariantRow): Promise<void> {
    return new Promise((resolve, reject) => {
      this.catalogService.addVariant(this.product.id, {
        size: row.size,
        stock: row.stock,
        additionalPrice: row.additionalPrice
      }).subscribe({ next: () => resolve(), error: () => reject(new Error('Error creando variante')) });
    });
  }

  private updateVariantAsync(row: VariantRow): Promise<void> {
    return new Promise((resolve, reject) => {
      this.catalogService.updateVariant(this.product.id, row.id!, {
        size: row.size,
        stock: row.stock,
        additionalPrice: row.additionalPrice
      }).subscribe({ next: () => resolve(), error: () => reject(new Error(`Error actualizando variante ${row.id}`)) });
    });
  }

  close(): void {
    this.closed.emit();
  }

  formatSizeLabel(size: ProductSize): string {
    return size === 'UNICO' ? 'Talla Única' : size;
  }
}
