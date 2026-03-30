import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { StoreOrderService } from '../../../core/services/store-order.service';
import { AuthService } from '../../../core/services/auth.service';
import { CheckoutRequest, StorePaymentMethod } from '../../../core/models';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  private fb = inject(FormBuilder);
  private storeOrderService = inject(StoreOrderService);
  private router = inject(Router);
  cartService = inject(CartService);
  authService = inject(AuthService);

  isSubmitting = false;
  errorMessage = '';

  paymentMethods: { value: StorePaymentMethod; label: string; icon: string }[] = [
    { value: 'CASH',          label: 'Efectivo',          icon: '💵' },
    { value: 'CREDIT_CARD',   label: 'Tarjeta de crédito', icon: '💳' },
    { value: 'DEBIT_CARD',    label: 'Tarjeta de débito',  icon: '💳' },
    { value: 'BANK_TRANSFER', label: 'Transferencia',       icon: '🏦' },
    { value: 'WEBPAY',        label: 'WebPay',              icon: '🛡️' },
    { value: 'MERCADOPAGO',   label: 'MercadoPago',         icon: '💙' },
  ];

  form = this.fb.group({
    customerName:    ['', [Validators.required, Validators.minLength(3)]],
    customerEmail:   ['', [Validators.required, Validators.email]],
    customerPhone:   [''],
    paymentMethod:   ['WEBPAY' as StorePaymentMethod, Validators.required],
    shippingAddress: [''],
    notes:           ['']
  });

  constructor() {
    // Prellenar con datos del usuario autenticado si existe
    const user = this.authService.currentUser();
    if (user) {
      this.form.patchValue({
        customerName: `${user.firstName} ${user.lastName}`,
        customerEmail: user.email
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid || this.cartService.totalItems() === 0) return;
    this.isSubmitting = true;
    this.errorMessage = '';

    const val = this.form.value;
    const request: CheckoutRequest = {
      customerName:    val.customerName!,
      customerEmail:   val.customerEmail!,
      customerPhone:   val.customerPhone || undefined,
      paymentMethod:   val.paymentMethod as StorePaymentMethod,
      shippingAddress: val.shippingAddress || undefined,
      notes:           val.notes || undefined
    };

    this.storeOrderService.checkout(request).subscribe({
      next: (order) => {
        this.isSubmitting = false;
        this.cartService.clearLocal();
        this.router.navigate(['/catalog/order', order.orderNumber]);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err?.error?.message ?? 'Error al procesar el pedido. Intenta de nuevo.';
      }
    });
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(price);
  }

  get f() { return this.form.controls; }
}
