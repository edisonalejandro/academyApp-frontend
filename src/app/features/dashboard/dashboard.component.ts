import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardSummary, JwtResponse } from '../../core/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  public authService = inject(AuthService);
  private dashboardService = inject(DashboardService);
  private router = inject(Router);

  currentUser: () => JwtResponse | null;

  stats: DashboardSummary | null = null;
  statsLoading = false;
  statsError = false;

  constructor() {
    this.currentUser = () => this.authService.currentUser();
  }

  ngOnInit(): void {
    if (this.authService.isAdmin()) {
      this.loadAdminStats();
    } else if (this.authService.isTeacher()) {
      this.loadQuickStats();
    }
  }

  getUserRoleDisplay(): string {
    const roles = this.authService.userRoles();
    if (roles.includes('ROLE_ADMIN')) return 'Administrador';
    if (roles.includes('ROLE_TEACHER')) return 'Profesor';
    if (roles.includes('ROLE_STUDENT')) return 'Estudiante';
    return 'Usuario';
  }

  logout(): void {
    this.authService.logout();
  }

  viewProfile(): void {
    this.router.navigate(['/profile']);
  }

  // Navegación para Admin
  navigateToUsers(): void {
    this.router.navigate(['/usuarios']);
  }

  navigateToPayments(): void {
    this.router.navigate(['/payments']);
  }

  navigateToPricing(): void {
    this.router.navigate(['/pricing']);
  }

  // Navegación para Teacher
  navigateToClasses(): void {
    this.router.navigate(['/classes']);
  }

  navigateToStudents(): void {
    this.router.navigate(['/usuarios/alumnos']);
  }

  // Navegación para Student
  navigateToMyClasses(): void {
    this.router.navigate(['/my-classes']);
  }

  navigateToMyPayments(): void {
    this.router.navigate(['/my-payments']);
  }

  // Navegación común
  navigateToPricingCalculator(): void {
    this.router.navigate(['/pricing']);
  }

  private loadAdminStats(): void {
    this.statsLoading = true;
    this.statsError = false;
    this.dashboardService.getSummary().subscribe({
      next: (data) => {
        this.stats = data;
        this.statsLoading = false;
      },
      error: () => {
        this.statsError = true;
        this.statsLoading = false;
      }
    });
  }

  private loadQuickStats(): void {
    this.statsLoading = true;
    this.statsError = false;
    this.dashboardService.getQuickStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.statsLoading = false;
      },
      error: () => {
        this.statsError = true;
        this.statsLoading = false;
      }
    });
  }
}