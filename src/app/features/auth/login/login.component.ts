import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest } from '../../../core/models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="login-container">
      <div class="login-card-wrapper">
        <mat-card class="login-card">
          <mat-card-header class="login-header">
            <mat-card-title>
              <mat-icon class="logo-icon">school</mat-icon>
              Iniciar Sesión
            </mat-card-title>
            <mat-card-subtitle>Estilo D Mua</mat-card-subtitle>
          </mat-card-header>

          <mat-card-content>
            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Usuario o Email</mat-label>
                <input
                  matInput
                  formControlName="username"
                  type="text"
                  autocomplete="username"
                  placeholder="Ingresa tu usuario o email"
                >
                <mat-icon matSuffix>person</mat-icon>
                <mat-error *ngIf="loginForm.get('username')?.hasError('required')">
                  El usuario es requerido
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Contraseña</mat-label>
                <input
                  matInput
                  formControlName="password"
                  [type]="hidePassword() ? 'password' : 'text'"
                  autocomplete="current-password"
                  placeholder="Ingresa tu contraseña"
                >
                <button
                  mat-icon-button
                  matSuffix
                  type="button"
                  (click)="togglePassword()"
                  [attr.aria-label]="'Mostrar contraseña'"
                >
                  <mat-icon>{{ hidePassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
                </button>
                <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
                  La contraseña es requerida
                </mat-error>
                <mat-error *ngIf="loginForm.get('password')?.hasError('minlength')">
                  La contraseña debe tener al menos 6 caracteres
                </mat-error>
              </mat-form-field>

              <div class="form-actions">
                <button
                  mat-raised-button
                  color="primary"
                  type="submit"
                  class="full-width login-button"
                  [disabled]="loginForm.invalid || authService.isLoading()"
                >
                  <ng-container *ngIf="authService.isLoading(); else loginContent">
                    <mat-spinner diameter="20" class="button-spinner"></mat-spinner>
                    Iniciando sesión...
                  </ng-container>
                  <ng-template #loginContent>
                    <mat-icon>login</mat-icon>
                    Iniciar Sesión
                  </ng-template>
                </button>
              </div>
            </form>
          </mat-card-content>

          <mat-card-actions class="login-actions">
            <div class="register-link">
              <span>¿No tienes cuenta?</span>
              <a routerLink="/auth/register" mat-button color="accent">
                Regístrate aquí
              </a>
            </div>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .login-card-wrapper {
      width: 100%;
      max-width: 400px;
    }

    .login-card {
      padding: 24px;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    .login-header {
      text-align: center;
      margin-bottom: 24px;
    }

    .login-header mat-card-title {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-size: 24px;
      font-weight: 600;
    }

    .logo-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #667eea;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .full-width {
      width: 100%;
    }

    .form-actions {
      margin-top: 16px;
    }

    .login-button {
      height: 48px;
      font-size: 16px;
      font-weight: 500;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .button-spinner {
      margin-right: 8px;
    }

    .login-actions {
      margin-top: 16px;
      display: flex;
      justify-content: center;
    }

    .register-link {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
    }

    @media (max-width: 480px) {
      .login-container {
        padding: 16px;
      }
      
      .login-card {
        padding: 20px;
      }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = signal(true);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    public authService: AuthService
  ) {
    this.loginForm = this.createForm();
    
    // Si ya está autenticado, redirigir al dashboard
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  togglePassword(): void {
    this.hidePassword.update(value => !value);
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const credentials: LoginRequest = this.loginForm.value;
      
      this.authService.login(credentials).subscribe({
        next: (response) => {
          this.showSuccess('¡Bienvenido! Has iniciado sesión correctamente.');
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Error en login:', error);
          let errorMessage = 'Error al iniciar sesión. Verifica tus credenciales.';
          
          if (error.status === 401) {
            errorMessage = 'Usuario o contraseña incorrectos.';
          } else if (error.status === 403) {
            errorMessage = 'Tu cuenta está bloqueada. Contacta al administrador.';
          } else if (error.status === 0) {
            errorMessage = 'No se puede conectar al servidor. Verifica tu conexión.';
          }
          
          this.showError(errorMessage);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 4000,
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 6000,
      panelClass: ['error-snackbar']
    });
  }
}