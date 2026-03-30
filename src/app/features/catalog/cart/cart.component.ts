import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartService = inject(CartService);
  isLoading = true;
  updatingItem: number | null = null;

  ngOnInit(): void {
    this.cartService.loadCart().subscribe({
      next: () => { this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  updateQty(variantId: number, qty: number): void {
    this.updatingItem = variantId;
    this.cartService.updateQuantity(variantId, qty).subscribe({
      next: () => { this.updatingItem = null; },
      error: () => { this.updatingItem = null; }
    });
  }

  removeItem(variantId: number): void {
    this.updatingItem = variantId;
    this.cartService.removeItem(variantId).subscribe({
      next: () => { this.updatingItem = null; },
      error: () => { this.updatingItem = null; }
    });
  }

  clearCart(): void {
    if (confirm('¿Vaciar el carrito?')) {
      this.cartService.clearCart().subscribe();
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(price);
  }
}
