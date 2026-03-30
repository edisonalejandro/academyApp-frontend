import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { PaymentService } from '../../../core/services/payment.service';
import { PaymentResponseDTO, PaymentStatus } from '../../../core/models';

@Component({
  selector: 'app-payments-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="page-container">
      <mat-card>
        <mat-card-header>
          <mat-icon mat-card-avatar>attach_money</mat-icon>
          <mat-card-title>Gestión de Pagos</mat-card-title>
          <mat-card-subtitle>Historial y estado de pagos</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          @if (loading) {
            <div class="loading-center">
              <mat-spinner diameter="48"></mat-spinner>
            </div>
          } @else if (error) {
            <p class="error-msg">No se pudieron cargar los pagos. Intenta de nuevo.</p>
          } @else {
            <table mat-table [dataSource]="payments" class="full-width">
              <ng-container matColumnDef="code">
                <th mat-header-cell *matHeaderCellDef>Código</th>
                <td mat-cell *matCellDef="let p">{{ p.paymentCode }}</td>
              </ng-container>
              <ng-container matColumnDef="student">
                <th mat-header-cell *matHeaderCellDef>Estudiante</th>
                <td mat-cell *matCellDef="let p">{{ p.studentName }}</td>
              </ng-container>
              <ng-container matColumnDef="course">
                <th mat-header-cell *matHeaderCellDef>Curso</th>
                <td mat-cell *matCellDef="let p">{{ p.courseName }}</td>
              </ng-container>
              <ng-container matColumnDef="amount">
                <th mat-header-cell *matHeaderCellDef>Monto</th>
                <td mat-cell *matCellDef="let p">{{ p.finalPrice | currency:'CLP':'symbol':'1.0-0' }}</td>
              </ng-container>
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Estado</th>
                <td mat-cell *matCellDef="let p">
                  <mat-chip [color]="statusColor(p.status)" highlighted>{{ p.status }}</mat-chip>
                </td>
              </ng-container>
              <ng-container matColumnDef="date">
                <th mat-header-cell *matHeaderCellDef>Fecha</th>
                <td mat-cell *matCellDef="let p">{{ p.paymentDate | date:'dd/MM/yyyy' }}</td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="columns"></tr>
              <tr mat-row *matRowDef="let row; columns: columns;"></tr>
            </table>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-container { padding: 24px; }
    .loading-center { display: flex; justify-content: center; padding: 48px; }
    .error-msg { color: var(--mat-sys-error); text-align: center; padding: 24px; }
    .full-width { width: 100%; }
  `]
})
export class PaymentsListComponent implements OnInit {
  private paymentService = inject(PaymentService);

  payments: PaymentResponseDTO[] = [];
  loading = false;
  error = false;
  columns = ['code', 'student', 'course', 'amount', 'status', 'date'];

  ngOnInit(): void {
    this.load();
  }

  statusColor(status: PaymentStatus): 'primary' | 'accent' | 'warn' {
    if (status === PaymentStatus.COMPLETED) return 'primary';
    if (status === PaymentStatus.PENDING) return 'accent';
    return 'warn';
  }

  private load(): void {
    this.loading = true;
    this.error = false;
    this.paymentService.getAllPayments().subscribe({
      next: (data: PaymentResponseDTO[]) => { this.payments = data; this.loading = false; },
      error: () => { this.error = true; this.loading = false; }
    });
  }
}
