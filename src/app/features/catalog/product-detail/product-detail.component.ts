import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CatalogService } from '../../../core/services/catalog.service';
import { CartService } from '../../../core/services/cart.service';
import { ProductDTO, ProductVariantDTO } from '../../../core/models';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private catalogService = inject(CatalogService);
  cartService = inject(CartService);

  product = signal<ProductDTO | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  selectedVariant = signal<ProductVariantDTO | null>(null);
  quantity = signal(1);
  adding = signal(false);
  added = signal(false);

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.catalogService.getProductBySlug(slug).subscribe({
        next: (p) => {
          this.product.set(p);
          if (p.variants?.length === 1) this.selectedVariant.set(p.variants[0]);
          this.loading.set(false);
        },
        error: () => { this.error.set('Producto no encontrado.'); this.loading.set(false); }
      });
    }
  }

  selectVariant(v: ProductVariantDTO): void {
    if (v.stock > 0) this.selectedVariant.set(v);
  }

  increment(): void { if (this.quantity() < (this.selectedVariant()?.stock ?? 1)) this.quantity.update(q => q + 1); }
  decrement(): void { if (this.quantity() > 1) this.quantity.update(q => q - 1); }

  addToCart(): void {
    const variant = this.selectedVariant();
    if (!variant || this.adding()) return;
    this.adding.set(true);
    this.cartService.addItem({ variantId: variant.id, quantity: this.quantity() }).subscribe({
      next: () => {
        this.adding.set(false); this.added.set(true);
        setTimeout(() => this.added.set(false), 2500);
      },
      error: () => this.adding.set(false)
    });
  }

  sizeLabel(size: string): string {
    return size === 'UNICO' ? 'Único' : size;
  }
}
