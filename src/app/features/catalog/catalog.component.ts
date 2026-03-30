import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CatalogService } from '../../core/services/catalog.service';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { ProductCategoryDTO, ProductDTO, ProductVariantDTO, AddToCartRequest } from '../../core/models';
import { EditProductDialogComponent } from './edit-product-dialog/edit-product-dialog.component';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, EditProductDialogComponent],
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {
  private catalogService = inject(CatalogService);
  cartService = inject(CartService);
  authService = inject(AuthService);

  categories = signal<ProductCategoryDTO[]>([]);
  products = signal<ProductDTO[]>([]);
  filteredProducts = signal<ProductDTO[]>([]);

  isLoading = signal(true);
  error = signal<string | null>(null);
  addingToCart = signal<number | null>(null);
  cartSuccess = signal<number | null>(null);

  selectedCategory = signal<string>('');
  searchQuery = signal<string>('');

  // Estado de selección de variante por producto
  selectedVariants = signal<Record<number, { variantId: number | null; quantity: number }>>({});

  // Edición de productos (admin)
  editingProduct = signal<ProductDTO | null>(null);

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading.set(true);
    this.catalogService.getCategories().subscribe({
      next: cats => this.categories.set(cats),
      error: () => {}
    });

    this.catalogService.getProducts().subscribe({
      next: products => {
        this.products.set(products);
        this.filteredProducts.set(products);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar el catálogo');
        this.isLoading.set(false);
      }
    });
  }

  filterByCategory(slug: string): void {
    this.selectedCategory.set(slug);
    this.applyFilters();
  }

  onSearch(q: string): void {
    this.searchQuery.set(q);
    this.applyFilters();
  }

  private applyFilters(): void {
    let list = this.products();
    const cat = this.selectedCategory();
    const q = this.searchQuery().toLowerCase();

    if (cat) {
      list = list.filter(p => p.categorySlug === cat);
    }
    if (q) {
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.description ?? '').toLowerCase().includes(q)
      );
    }
    this.filteredProducts.set(list);
  }

  getVariantForProduct(productId: number): { variantId: number | null; quantity: number } {
    return this.selectedVariants()[productId] ?? { variantId: null, quantity: 1 };
  }

  selectVariant(productId: number, variantId: number): void {
    this.selectedVariants.update(v => ({
      ...v,
      [productId]: { variantId, quantity: v[productId]?.quantity ?? 1 }
    }));
  }

  setQuantity(productId: number, qty: number): void {
    this.selectedVariants.update(v => ({
      ...v,
      [productId]: { variantId: v[productId]?.variantId ?? null, quantity: Math.max(1, qty) }
    }));
  }

  // Agrupar variantes por talla para un producto
  getSizes(product: ProductDTO): string[] {
    const sizes = [...new Set(product.variants.filter(v => v.stock > 0).map(v => v.size))];
    const order = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'UNICO'];
    return sizes.sort((a, b) => order.indexOf(a) - order.indexOf(b));
  }

  getVariantBySize(product: ProductDTO, size: string): ProductVariantDTO | undefined {
    return product.variants.find(v => v.size === size && v.stock > 0);
  }

  getTotalPrice(product: ProductDTO): number {
    const sel = this.selectedVariants()[product.id];
    if (!sel?.variantId) return product.basePrice;
    const variant = product.variants.find(v => v.id === sel.variantId);
    return product.basePrice + (variant?.additionalPrice ?? 0);
  }

  addToCart(product: ProductDTO): void {
    const sel = this.selectedVariants()[product.id];
    if (!sel?.variantId) {
      // Si hay una sola variante, usarla automáticamente
      const firstVariant = product.variants.find(v => v.stock > 0);
      if (!firstVariant) return;
      this.doAddToCart(product.id, firstVariant.id, sel?.quantity ?? 1);
      return;
    }
    this.doAddToCart(product.id, sel.variantId, sel.quantity ?? 1);
  }

  private doAddToCart(productId: number, variantId: number, quantity: number): void {
    this.addingToCart.set(productId);
    const request: AddToCartRequest = { variantId, quantity };

    this.cartService.addItem(request).subscribe({
      next: () => {
        this.addingToCart.set(null);
        this.cartSuccess.set(productId);
        setTimeout(() => this.cartSuccess.set(null), 2000);
      },
      error: (err) => {
        this.addingToCart.set(null);
        alert(err?.error?.message ?? 'Error al agregar al carrito');
      }
    });
  }

  hasStock(product: ProductDTO): boolean {
    return product.variants.some(v => v.stock > 0);
  }

  getSelectedVariantStock(product: ProductDTO): number {
    const sel = this.selectedVariants()[product.id];
    if (sel?.variantId) {
      const v = product.variants.find(v => v.id === sel.variantId);
      return v?.stock ?? 0;
    }
    // Sin selección: retornar el mínimo stock entre variantes activas
    const stocks = product.variants.filter(v => v.stock > 0).map(v => v.stock);
    return stocks.length > 0 ? Math.min(...stocks) : 0;
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(price);
  }

  // ---- Admin: edición de productos ----

  openEditProduct(product: ProductDTO): void {
    this.editingProduct.set(product);
  }

  onProductSaved(updated: ProductDTO): void {
    this.editingProduct.set(null);
    // Actualizar en las listas sin recargar todo
    this.products.update(list =>
      list.map(p => p.id === updated.id ? updated : p)
    );
    this.filteredProducts.update(list =>
      list.map(p => p.id === updated.id ? updated : p)
    );
  }

  closeEditDialog(): void {
    this.editingProduct.set(null);
  }
}
