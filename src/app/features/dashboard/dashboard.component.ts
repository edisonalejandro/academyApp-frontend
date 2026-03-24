import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { JwtResponse } from '../../core/models';

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
  MatDividerModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  currentUser: () => JwtResponse | null;
  
  stats = {
    totalUsers: 156,
    totalClasses: 24,
    monthlyRevenue: 45000
  };

  constructor(
    public authService: AuthService,
    private router: Router
  ) {
    this.currentUser = () => this.authService.currentUser();
  }

  ngOnInit(): void {
    // Cargar estadísticas reales aquí
    if (this.authService.isAdmin()) {
      this.loadAdminStats();
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
    // TODO: Implementar vista de perfil
    console.log('Ver perfil');
  }

  // Navegación para Admin
  navigateToUsers(): void {
    this.router.navigate(['/users']);
  }

  navigateToPayments(): void {
    this.router.navigate(['/payments']);
  }

  navigateToPricing(): void {
    this.router.navigate(['/pricing/rules']);
  }

  // Navegación para Teacher
  navigateToClasses(): void {
    this.router.navigate(['/classes']);
  }

  navigateToStudents(): void {
    this.router.navigate(['/students']);
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
    this.router.navigate(['/pricing/calculator']);
  }

  private loadAdminStats(): void {
    // TODO: Implementar carga de estadísticas reales desde el backend
    // Aquí llamarías a los servicios correspondientes
  }
}