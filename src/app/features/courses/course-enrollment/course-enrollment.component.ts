import { Component, Inject, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { 
  CourseDTO, 
  StudentCategory, 
  PaymentMethod,
  PricingCalculationDTO,
  PricingOptionDTO,
  PaymentRequestDTO
} from '../../../core/models';
import { PricingService } from '../../../core/services/pricing.service';
import { PaymentService } from '../../../core/services/payment.service';

@Component({
  selector: 'app-course-enrollment',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatRadioModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './course-enrollment.component.html',
  styleUrl: './course-enrollment.component.css'
})
export class CourseEnrollmentComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<CourseEnrollmentComponent>);
  private pricingService = inject(PricingService);
  private paymentService = inject(PaymentService);
  private snackBar = inject(MatSnackBar);

  // Signals
  step = signal<'category' | 'package' | 'payment' | 'confirm'>('category');
  loading = signal(false);
  pricingOptions = signal<PricingCalculationDTO | null>(null);
  selectedCategory = signal<StudentCategory | null>(null);
  selectedOption = signal<PricingOptionDTO | null>(null);
  selectedPaymentMethod = signal<PaymentMethod | null>(null);
  transactionId = signal<string>('');
  notes = signal<string>('');

  // Categorías disponibles
  categories = [
    { value: StudentCategory.REGULAR, label: 'Regular', icon: 'person', description: 'Estudiante regular' },
    { value: StudentCategory.UNIVERSITY, label: 'Universitario', icon: 'school', description: 'Con carnet universitario' },
    { value: StudentCategory.COUPLE, label: 'Pareja', icon: 'favorite', description: 'Inscripción en pareja' },
    { value: StudentCategory.SENIOR, label: 'Senior', icon: 'elderly', description: 'Mayor de 60 años' },
    { value: StudentCategory.CHILD, label: 'Niño', icon: 'child_care', description: 'Menor de 12 años' }
  ];

  // Métodos de pago disponibles
  paymentMethods = [
    { value: PaymentMethod.CASH, label: 'Efectivo', icon: 'money' },
    { value: PaymentMethod.CREDIT_CARD, label: 'Tarjeta de Crédito', icon: 'credit_card' },
    { value: PaymentMethod.DEBIT_CARD, label: 'Tarjeta de Débito', icon: 'payment' },
    { value: PaymentMethod.BANK_TRANSFER, label: 'Transferencia Bancaria', icon: 'account_balance' },
    { value: PaymentMethod.MOBILE_PAYMENT, label: 'Pago Móvil', icon: 'phone_android' }
  ];

  constructor(@Inject(MAT_DIALOG_DATA) public data: { course: CourseDTO }) {}

  ngOnInit(): void {
    // Podrías preconfigrar una categoría si el usuario ya tiene una guardada
  }

  selectCategory(category: StudentCategory): void {
    this.selectedCategory.set(category);
    this.loadPricingOptions(category);
  }

  loadPricingOptions(category: StudentCategory): void {
    this.loading.set(true);
    const personCount = category === StudentCategory.COUPLE ? 2 : 1;

    this.pricingService.calculatePricing(this.data.course.id, category, personCount)
      .subscribe({
        next: (pricing) => {
          this.pricingOptions.set(pricing);
          this.loading.set(false);
          this.step.set('package');
        },
        error: (err) => {
          console.error('Error al cargar opciones de precio:', err);
          this.snackBar.open('Error al cargar opciones de pago', 'Cerrar', { duration: 3000 });
          this.loading.set(false);
        }
      });
  }

  selectOption(option: PricingOptionDTO): void {
    this.selectedOption.set(option);
    this.step.set('payment');
  }

  selectPaymentMethod(method: PaymentMethod): void {
    this.selectedPaymentMethod.set(method);
    this.step.set('confirm');
  }

  goBack(): void {
    const currentStep = this.step();
    if (currentStep === 'package') {
      this.step.set('category');
    } else if (currentStep === 'payment') {
      this.step.set('package');
    } else if (currentStep === 'confirm') {
      this.step.set('payment');
    }
  }

  confirmEnrollment(): void {
    const category = this.selectedCategory();
    const option = this.selectedOption();
    const paymentMethod = this.selectedPaymentMethod();

    if (!category || !option || !paymentMethod) {
      this.snackBar.open('Por favor completa todos los pasos', 'Cerrar', { duration: 3000 });
      return;
    }

    this.loading.set(true);

    const paymentRequest: PaymentRequestDTO = {
      courseId: this.data.course.id,
      pricingRuleId: option.pricingRuleId,
      studentCategory: category,
      paymentMethod: paymentMethod,
      personCount: category === StudentCategory.COUPLE ? 2 : 1,
      notes: this.notes() || undefined,
      transactionId: this.transactionId() || undefined
    };

    this.paymentService.processPayment(paymentRequest).subscribe({
      next: (response) => {
        this.loading.set(false);
        this.snackBar.open('¡Inscripción exitosa!', 'Cerrar', { duration: 3000 });
        this.dialogRef.close({ success: true, payment: response });
      },
      error: (err) => {
        console.error('Error al procesar el pago:', err);
        this.loading.set(false);
        this.snackBar.open(
          err.error?.message || 'Error al procesar el pago. Por favor, intenta de nuevo.',
          'Cerrar',
          { duration: 5000 }
        );
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price);
  }

  getPricingTypeLabel(pricingType: string): string {
    const labels: Record<string, string> = {
      'SINGLE_CLASS': 'Clase Individual',
      'PACKAGE_4': 'Paquete de 4 Clases',
      'PACKAGE_8': 'Paquete de 8 Clases',
      'PACKAGE_12': 'Paquete de 12 Clases',
      'COUPLE_PACKAGE_8': 'Paquete Pareja 8 Clases',
      'UNLIMITED_MONTHLY': 'Ilimitado Mensual'
    };
    return labels[pricingType] || pricingType;
  }

  getCategoryLabel(category: StudentCategory | null): string {
    if (!category) return '';
    const found = this.categories.find(c => c.value === category);
    return found?.label || '';
  }

  getPaymentMethodLabel(method: PaymentMethod | null): string {
    if (!method) return '';
    const found = this.paymentMethods.find(m => m.value === method);
    return found?.label || '';
  }

  getStepNumber(): number {
    const steps = { category: 1, package: 2, payment: 3, confirm: 4 };
    return steps[this.step()];
  }
}
