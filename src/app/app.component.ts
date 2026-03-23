import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from './core/services/auth.service';
import { HeaderComponent } from './layout/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatProgressSpinnerModule,
    HeaderComponent
  ],
  template: `
    <div class="loading-overlay" *ngIf="authService.isLoading(); else mainContent">
      <mat-spinner diameter="50"></mat-spinner>
      <p class="loading-text">Cargando...</p>
    </div>
    
    <ng-template #mainContent>
      <app-header></app-header>
      <div class="main-content">
        <router-outlet></router-outlet>
      </div>
    </ng-template>
  `,
  styles: [`
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.9);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      gap: 16px;
    }

    .loading-text {
      margin: 0;
      color: #666;
      font-size: 16px;
    }

    .main-content {
      padding-top: 80px;
      min-height: 100vh;
    }

    @media (max-width: 480px) {
      .main-content {
        padding-top: 70px;
      }
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'academyApp-frontend';

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    // El servicio de auth ya se inicializa automáticamente
    // Aquí podrías agregar inicializaciones adicionales
  }
}