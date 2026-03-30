import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { PricingService } from '../../../core/services/pricing.service';
import { PricingRuleDTO } from '../../../core/models';

@Component({
  selector: 'app-pricing-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="page-container">
      <mat-card>
        <mat-card-header>
          <mat-icon mat-card-avatar>price_change</mat-icon>
          <mat-card-title>Reglas de Precios</mat-card-title>
          <mat-card-subtitle>Tarifas y descuentos configurados</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          @if (loading) {
            <div class="loading-center">
              <mat-spinner diameter="48"></mat-spinner>
            </div>
          } @else if (error) {
            <p class="error-msg">No se pudieron cargar las reglas de precios. Intenta de nuevo.</p>
          } @else {
            <table mat-table [dataSource]="rules" class="full-width">
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>Nombre</th>
                <td mat-cell *matCellDef="let r">{{ r.name }}</td>
              </ng-container>
              <ng-container matColumnDef="type">
                <th mat-header-cell *matHeaderCellDef>Tipo</th>
                <td mat-cell *matCellDef="let r">{{ r.pricingType }}</td>
              </ng-container>
              <ng-container matColumnDef="category">
                <th mat-header-cell *matHeaderCellDef>Categoría</th>
                <td mat-cell *matCellDef="let r">{{ r.studentCategory }}</td>
              </ng-container>
              <ng-container matColumnDef="price">
                <th mat-header-cell *matHeaderCellDef>Precio Final</th>
                <td mat-cell *matCellDef="let r">{{ r.finalPrice | currency:'CLP':'symbol':'1.0-0' }}</td>
              </ng-container>
              <ng-container matColumnDef="discount">
                <th mat-header-cell *matHeaderCellDef>Descuento</th>
                <td mat-cell *matCellDef="let r">{{ r.discountPercentage }}%</td>
              </ng-container>
              <ng-container matColumnDef="active">
                <th mat-header-cell *matHeaderCellDef>Estado</th>
                <td mat-cell *matCellDef="let r">
                  <mat-chip [color]="r.isActive ? 'primary' : 'warn'" highlighted>
                    {{ r.isActive ? 'Activo' : 'Inactivo' }}
                  </mat-chip>
                </td>
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
export class PricingListComponent implements OnInit {
  private pricingService = inject(PricingService);

  rules: PricingRuleDTO[] = [];
  loading = true;
  error = false;
  columns = ['name', 'type', 'category', 'price', 'discount', 'active'];

  ngOnInit(): void {
    this.pricingService.getPricingRules(undefined, undefined, false).subscribe({
      next: (data: PricingRuleDTO[]) => {
        this.rules = data;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }
}
