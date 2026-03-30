import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StoreOrderService } from '../../../core/services/store-order.service';
import { StoreOrderDTO } from '../../../core/models';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-confirmation.component.html',
  styleUrl: './order-confirmation.component.css'
})
export class OrderConfirmationComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private storeOrderService = inject(StoreOrderService);

  order = signal<StoreOrderDTO | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const orderNumber = this.route.snapshot.paramMap.get('orderNumber');
    if (orderNumber) {
      this.storeOrderService.getOrderByNumber(orderNumber).subscribe({
        next: (data) => { this.order.set(data); this.loading.set(false); },
        error: () => { this.error.set('No se pudo cargar la orden.'); this.loading.set(false); }
      });
    }
  }

  paymentLabel(method: string): string {
    const map: Record<string, string> = {
      CASH: 'Efectivo', CREDIT_CARD: 'Tarjeta de Crédito',
      DEBIT_CARD: 'Tarjeta de Débito', BANK_TRANSFER: 'Transferencia Bancaria',
      WEBPAY: 'WebPay', MERCADOPAGO: 'MercadoPago'
    };
    return map[method] ?? method;
  }
}
