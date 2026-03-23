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
  template: `
    <div class="dashboard-container">
      <!-- Header -->
      <mat-toolbar color="primary" class="dashboard-header">
        <mat-icon class="logo-icon">school</mat-icon>
        <span class="app-title">Academia de Baile</span>
        
        <div class="spacer"></div>
        
        <div class="user-menu">
          <button mat-icon-button [matMenuTriggerFor]="userMenu">
            <mat-icon>account_circle</mat-icon>
          </button>
          <mat-menu #userMenu="matMenu">
            <div class="user-info">
              <strong>{{ currentUser()?.firstName }} {{ currentUser()?.lastName }}</strong>
              <small>{{ getUserRoleDisplay() }}</small>
            </div>
            <mat-divider></mat-divider>
            <button mat-menu-item (click)="viewProfile()">
              <mat-icon>person</mat-icon>
              <span>Mi Perfil</span>
            </button>
            <button mat-menu-item (click)="logout()">
              <mat-icon>logout</mat-icon>
              <span>Cerrar Sesión</span>
            </button>
          </mat-menu>
        </div>
      </mat-toolbar>

      <!-- Main Content -->
      <div class="dashboard-content">
        <div class="welcome-section">
          <h1>¡Bienvenido, {{ currentUser()?.firstName }}!</h1>
          <p class="welcome-subtitle">
            <ng-container *ngIf="authService.isAdmin(); else notAdmin">
              Panel de Administración - Academia de Baile
            </ng-container>
            <ng-template #notAdmin>
              <ng-container *ngIf="authService.isTeacher(); else notTeacher">
                Panel de Profesor - Gestiona tus clases y estudiantes
              </ng-container>
              <ng-template #notTeacher>
                <ng-container *ngIf="authService.isStudent(); else defaultPanel">
                  Panel de Estudiante - Consulta tus clases y pagos
                </ng-container>
                <ng-template #defaultPanel>
                  Panel Principal - Academia de Baile
                </ng-template>
              </ng-template>
            </ng-template>
            <!-- Admin Cards -->
            <mat-card class="action-card">
              <mat-card-header>
                <mat-icon mat-card-avatar class="card-icon admin-icon">people</mat-icon>
                <mat-card-title>Gestión de Usuarios</mat-card-title>
                <mat-card-subtitle>Administrar estudiantes y profesores</mat-card-subtitle>
              </mat-card-header>
              <mat-card-actions>
                <button mat-raised-button color="primary" (click)="navigateToUsers()">
                  <mat-icon>arrow_forward</mat-icon>
                  Ver Usuarios
                </button>
              </mat-card-actions>
            </mat-card>

            <mat-card class="action-card">
              <mat-card-header>
                <mat-icon mat-card-avatar class="card-icon admin-icon">attach_money</mat-icon>
                <mat-card-title>Pagos y Finanzas</mat-card-title>
                <mat-card-subtitle>Reportes financieros y transacciones</mat-card-subtitle>
              </mat-card-header>
              <mat-card-actions>
                <button mat-raised-button color="primary" (click)="navigateToPayments()">
                  <mat-icon>arrow_forward</mat-icon>
                  Ver Pagos
                </button>
              </mat-card-actions>
            </mat-card>

            <mat-card class="action-card">
              <mat-card-header>
                <mat-icon mat-card-avatar class="card-icon admin-icon">settings</mat-icon>
                <mat-card-title>Configuración de Precios</mat-card-title>
                <mat-card-subtitle>Gestionar reglas de precios</mat-card-subtitle>
              </mat-card-header>
              <mat-card-actions>
                <button mat-raised-button color="primary" (click)="navigateToPricing()">
                  <mat-icon>arrow_forward</mat-icon>
                  Configurar
                </button>
              </mat-card-actions>
            </mat-card>

          <ng-container *ngIf="authService.isTeacher()">
            <!-- Teacher Cards -->
            <mat-card class="action-card">
              <mat-card-header>
                <mat-icon mat-card-avatar class="card-icon teacher-icon">class</mat-icon>
                <mat-card-title>Mis Clases</mat-card-title>
                <mat-card-subtitle>Ver y gestionar tus clases</mat-card-subtitle>
              </mat-card-header>
              <mat-card-actions>
                <button mat-raised-button color="accent" (click)="navigateToClasses()">
                  <mat-icon>arrow_forward</mat-icon>
                  Ver Clases
                </button>
              </mat-card-actions>
            </mat-card>

            <mat-card class="action-card">
              <mat-card-header>
                <mat-icon mat-card-avatar class="card-icon teacher-icon">group</mat-icon>
                <mat-card-title>Mis Estudiantes</mat-card-title>
                <mat-card-subtitle>Gestionar estudiantes inscritos</mat-card-subtitle>
              </mat-card-header>
              <mat-card-actions>
                <button mat-raised-button color="accent" (click)="navigateToStudents()">
                  <mat-icon>arrow_forward</mat-icon>
                  Ver Estudiantes
                </button>
              </mat-card-actions>
            </mat-card>
          </ng-container>

          <ng-container *ngIf="authService.isStudent()">
            <!-- Student Cards -->
            <mat-card class="action-card">
              <mat-card-header>
                <mat-icon mat-card-avatar class="card-icon student-icon">schedule</mat-icon>
                <mat-card-title>Mis Clases</mat-card-title>
                <mat-card-subtitle>Horarios y clases inscritas</mat-card-subtitle>
              </mat-card-header>
              <mat-card-actions>
                <button mat-raised-button color="primary" (click)="navigateToMyClasses()">
                  <mat-icon>arrow_forward</mat-icon>
                  Ver Horarios
                </button>
              </mat-card-actions>
            </mat-card>

            <mat-card class="action-card">
              <mat-card-header>
                <mat-icon mat-card-avatar class="card-icon student-icon">payment</mat-icon>
                <mat-card-title>Mis Pagos</mat-card-title>
                <mat-card-subtitle>Historial de pagos y facturas</mat-card-subtitle>
              </mat-card-header>
              <mat-card-actions>
                <button mat-raised-button color="primary" (click)="navigateToMyPayments()">
                  <mat-icon>arrow_forward</mat-icon>
                  Ver Pagos
                </button>
              </mat-card-actions>
            </mat-card>
          </ng-container>

          <!-- Card común para todos -->
          <mat-card class="action-card">
            <mat-card-header>
              <mat-icon mat-card-avatar class="card-icon common-icon">calculate</mat-icon>
              <mat-card-title>Calculadora de Precios</mat-card-title>
              <mat-card-subtitle>Consultar precios de clases</mat-card-subtitle>
            </mat-card-header>
            <mat-card-actions>
              <button mat-raised-button color="accent" (click)="navigateToPricingCalculator()">
                <mat-icon>arrow_forward</mat-icon>
                Calcular
              </button>
            </mat-card-actions>
          </mat-card>
        </div>

        <!-- Stats Section (Solo para Admin y Teacher) -->
        <div class="stats-section" *ngIf="authService.isAdmin() || authService.isTeacher()">
          <h2>Estadísticas Rápidas</h2>
          <div class="stats-grid">
            <div class="stat-card">
              <mat-icon>people</mat-icon>
              <div class="stat-content">
                <span class="stat-number">{{ stats.totalUsers }}</span>
                <span class="stat-label">Total Usuarios</span>
              </div>
            </div>
            
            <div class="stat-card">
              <mat-icon>class</mat-icon>
              <div class="stat-content">
                <span class="stat-number">{{ stats.totalClasses }}</span>
                <span class="stat-label">Clases Activas</span>
              </div>
            </div>
            
            <div class="stat-card">
              <mat-icon>attach_money</mat-icon>
              <div class="stat-content">
                <span class="stat-number">{{ stats.monthlyRevenue | currency:'USD':'symbol':'1.0-0' }}</span>
                <span class="stat-label">Ingresos del Mes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      min-height: 100vh;
      background-color: #f5f5f5;
    }

    .dashboard-header {
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .logo-icon {
      margin-right: 8px;
    }

    .app-title {
      font-weight: 500;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .user-info {
      padding: 8px 16px;
      display: flex;
      flex-direction: column;
    }

    .user-info strong {
      margin-bottom: 4px;
    }

    .user-info small {
      color: #666;
      font-size: 12px;
    }

    .dashboard-content {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .welcome-section {
      margin-bottom: 32px;
      text-align: center;
    }

    .welcome-section h1 {
      margin: 0 0 8px 0;
      font-size: 2rem;
      color: #333;
    }

    .welcome-subtitle {
      color: #666;
      font-size: 1.1rem;
      margin: 0;
    }

    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
    }

    .action-card {
      transition: transform 0.2s ease-in-out;
      cursor: pointer;
    }

    .action-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .card-icon {
      width: 48px;
      height: 48px;
      font-size: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
    }

    .admin-icon {
      background-color: #e3f2fd;
      color: #1976d2;
    }

    .teacher-icon {
      background-color: #f3e5f5;
      color: #7b1fa2;
    }

    .student-icon {
      background-color: #e8f5e8;
      color: #388e3c;
    }

    .common-icon {
      background-color: #fff3e0;
      color: #f57c00;
    }

    .stats-section {
      margin-top: 40px;
    }

    .stats-section h2 {
      text-align: center;
      margin-bottom: 24px;
      color: #333;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }

    .stat-card {
      background: white;
      padding: 24px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .stat-card mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #666;
    }

    .stat-content {
      display: flex;
      flex-direction: column;
    }

    .stat-number {
      font-size: 24px;
      font-weight: bold;
      color: #333;
    }

    .stat-label {
      font-size: 14px;
      color: #666;
    }

    @media (max-width: 768px) {
      .dashboard-content {
        padding: 16px;
      }

      .cards-grid {
        grid-template-columns: 1fr;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .welcome-section h1 {
        font-size: 1.5rem;
      }
    }
  `]
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