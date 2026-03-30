import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ClassSessionService } from '../../../core/services/class-session.service';
import { ClassSessionDTO, ClassStatus } from '../../../core/models';

@Component({
  selector: 'app-classes-list',
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
          <mat-icon mat-card-avatar>event</mat-icon>
          <mat-card-title>Sesiones de Clase</mat-card-title>
          <mat-card-subtitle>Listado de clases programadas</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          @if (loading) {
            <div class="loading-center">
              <mat-spinner diameter="48"></mat-spinner>
            </div>
          } @else if (error) {
            <p class="error-msg">No se pudieron cargar las sesiones. Intenta de nuevo.</p>
          } @else {
            <table mat-table [dataSource]="sessions" class="full-width">
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>Sesión</th>
                <td mat-cell *matCellDef="let s">{{ s.sessionName }}</td>
              </ng-container>
              <ng-container matColumnDef="course">
                <th mat-header-cell *matHeaderCellDef>Curso</th>
                <td mat-cell *matCellDef="let s">{{ s.courseName }}</td>
              </ng-container>
              <ng-container matColumnDef="teacher">
                <th mat-header-cell *matHeaderCellDef>Profesor</th>
                <td mat-cell *matCellDef="let s">{{ s.teacherName }}</td>
              </ng-container>
              <ng-container matColumnDef="date">
                <th mat-header-cell *matHeaderCellDef>Fecha</th>
                <td mat-cell *matCellDef="let s">{{ s.scheduledDate | date:'dd/MM/yyyy HH:mm' }}</td>
              </ng-container>
              <ng-container matColumnDef="location">
                <th mat-header-cell *matHeaderCellDef>Lugar</th>
                <td mat-cell *matCellDef="let s">{{ s.location }}</td>
              </ng-container>
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Estado</th>
                <td mat-cell *matCellDef="let s">
                  <mat-chip [color]="statusColor(s.status)" highlighted>{{ s.status }}</mat-chip>
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
export class ClassesListComponent implements OnInit {
  private classSessionService = inject(ClassSessionService);

  sessions: ClassSessionDTO[] = [];
  loading = true;
  error = false;
  columns = ['name', 'course', 'teacher', 'date', 'location', 'status'];

  ngOnInit(): void {
    this.classSessionService.getAllSessions().subscribe({
      next: (data: ClassSessionDTO[]) => {
        this.sessions = data;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }

  statusColor(status: ClassStatus): 'primary' | 'accent' | 'warn' {
    switch (status) {
      case ClassStatus.SCHEDULED: return 'primary';
      case ClassStatus.IN_PROGRESS: return 'accent';
      case ClassStatus.COMPLETED: return 'primary';
      default: return 'warn';
    }
  }
}
