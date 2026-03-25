import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { Router, RouterLink } from '@angular/router';

import { EnrollmentService } from '../../../core/services/enrollment.service';
import { EnrollmentDTO, EnrollmentStatus } from '../../../core/models';

@Component({
  selector: 'app-my-classes',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressBarModule,
    MatDividerModule,
    RouterLink
  ],
  templateUrl: './my-classes.component.html',
  styleUrl: './my-classes.component.css'
})
export class MyClassesComponent implements OnInit {
  private enrollmentService = inject(EnrollmentService);
  private router = inject(Router);

  enrollments: EnrollmentDTO[] = [];
  loading = false;
  error: string | null = null;

  ngOnInit(): void {
    this.loadMyClasses();
  }

  loadMyClasses(): void {
    this.loading = true;
    this.error = null;
    
    this.enrollmentService.getMyActiveEnrollments().subscribe({
      next: (enrollments) => {
        this.enrollments = enrollments;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar mis clases:', err);
        this.error = 'No se pudieron cargar las clases. Por favor, intenta de nuevo.';
        this.loading = false;
      }
    });
  }

  getStatusColor(status: EnrollmentStatus): string {
    switch (status) {
      case EnrollmentStatus.ACTIVE:
        return 'primary';
      case EnrollmentStatus.PENDING:
        return 'accent';
      case EnrollmentStatus.COMPLETED:
        return 'primary';
      case EnrollmentStatus.CANCELLED:
        return 'warn';
      case EnrollmentStatus.SUSPENDED:
        return 'warn';
      case EnrollmentStatus.HOURS_EXHAUSTED:
        return 'warn';
      default:
        return 'primary';
    }
  }

  getStatusLabel(status: EnrollmentStatus): string {
    switch (status) {
      case EnrollmentStatus.ACTIVE:
        return 'Activa';
      case EnrollmentStatus.PENDING:
        return 'Pendiente';
      case EnrollmentStatus.COMPLETED:
        return 'Completada';
      case EnrollmentStatus.CANCELLED:
        return 'Cancelada';
      case EnrollmentStatus.SUSPENDED:
        return 'Suspendida';
      case EnrollmentStatus.HOURS_EXHAUSTED:
        return 'Horas Agotadas';
      case EnrollmentStatus.TRANSFERRED:
        return 'Transferida';
      default:
        return status;
    }
  }

  getProgressPercentage(enrollment: EnrollmentDTO): number {
    if (enrollment.purchasedHours === 0) return 0;
    return (enrollment.usedHours / enrollment.purchasedHours) * 100;
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
