import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';

import { AuthService } from '../../../core/services/auth.service';
import { RegisterRequest } from '../../../core/models';

@Component({
  selector: 'app-register',
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
    MatSnackBarModule,
    MatStepperModule
  ],
  template: `
    <div class="register-container">
      <div class="register-card-wrapper">
        <mat-card class="register-card">
          <mat-card-header class="register-header">
            <mat-card-title>
              <mat-icon class="logo-icon">school</mat-icon>
              Crear Cuenta
            </mat-card-title>
            <mat-card-subtitle>Estilo D Mua</mat-card-subtitle>
          </mat-card-header>

          <mat-card-content>
            <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="register-form">
              
              <!-- Información Personal -->
              <div class="form-section">
                <h3 class="section-title">
                  <mat-icon>person</mat-icon>
                  Información Personal
                </h3>
                
                <div class="form-row">
                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>Nombre</mat-label>
                    <input
                      matInput
                      formControlName="firstName"
                      type="text"
                      placeholder="Tu nombre"
                    >
                    <mat-error *ngIf="registerForm.get('firstName')?.hasError('required')">
                      El nombre es requerido
                    </mat-error>
                    <mat-error *ngIf="registerForm.get('firstName')?.hasError('minlength')">
                      Mínimo 2 caracteres
                    </mat-error>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>Apellido</mat-label>
                    <input
                      matInput
                      formControlName="lastName"
                      type="text"
                      placeholder="Tu apellido"
                    >
                    <mat-error *ngIf="registerForm.get('lastName')?.hasError('required')">
                      El apellido es requerido
                    </mat-error>
                    <mat-error *ngIf="registerForm.get('lastName')?.hasError('minlength')">
                      Mínimo 2 caracteres
                    </mat-error>
                  </mat-form-field>
                </div>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Teléfono (Opcional)</mat-label>
                  <input
                    matInput
                    formControlName="phone"
                    type="tel"
                    placeholder="+56 9 1234 5678"
                  >
                  <mat-icon matSuffix>phone</mat-icon>
                  <mat-error *ngIf="registerForm.get('phone')?.hasError('pattern')">
                    Formato de teléfono inválido
                  </mat-error>
                </mat-form-field>
              </div>

              <!-- Información de Cuenta -->
              <div class="form-section">
                <h3 class="section-title">
                  <mat-icon>account_circle</mat-icon>
                  Información de Cuenta
                </h3>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Nombre de Usuario</mat-label>
                  <input
                    matInput
                    formControlName="username"
                    type="text"
                    placeholder="usuario123"
                  >
                  <mat-icon matSuffix>person</mat-icon>
                  <mat-error *ngIf="registerForm.get('username')?.hasError('required')">
                    El usuario es requerido
                  </mat-error>
                  <mat-error *ngIf="registerForm.get('username')?.hasError('minlength')">
                    Mínimo 3 caracteres
                  </mat-error>
                  <mat-error *ngIf="registerForm.get('username')?.hasError('pattern')">
                    Solo letras, números y guiones bajos
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Email</mat-label>
                  <input
                    matInput
                    formControlName="email"
                    type="email"
                    placeholder="tu@email.com"
                  >
                  <mat-icon matSuffix>email</mat-icon>
                  <mat-error *ngIf="registerForm.get('email')?.hasError('required')">
                    El email es requerido
                  </mat-error>
                  <mat-error *ngIf="registerForm.get('email')?.hasError('email')">
                    Email inválido
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Contraseña</mat-label>
                  <input
                    matInput
                    formControlName="password"
                    [type]="hidePassword() ? 'password' : 'text'"
                    placeholder="Mínimo 6 caracteres"
                  >
                  <button
                    mat-icon-button
                    matSuffix
                    type="button"
                    (click)="togglePassword()"
                  >
                    <mat-icon>{{ hidePassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
                  </button>
                  <mat-error *ngIf="registerForm.get('password')?.hasError('required')">
                    La contraseña es requerida
                  </mat-error>
                  <mat-error *ngIf="registerForm.get('password')?.hasError('minlength')">
                    Mínimo 6 caracteres
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Confirmar Contraseña</mat-label>
                  <input
                    matInput
                    formControlName="confirmPassword"
                    [type]="hideConfirmPassword() ? 'password' : 'text'"
                    placeholder="Repite tu contraseña"
                  >
                  <button
                    mat-icon-button
                    matSuffix
                    type="button"
                    (click)="toggleConfirmPassword()"
                  >
                    <mat-icon>{{ hideConfirmPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
                  </button>
                  <mat-error *ngIf="registerForm.get('confirmPassword')?.hasError('required')">
                    Confirma tu contraseña
                  </mat-error>
                  <mat-error *ngIf="registerForm.hasError('passwordMismatch')">
                    Las contraseñas no coinciden
                  </mat-error>
                </mat-form-field>
              </div>

              <div class="form-actions">
                <button
                  mat-raised-button
                  color="primary"
                  type="submit"
                  class="full-width register-button"
                  [disabled]="registerForm.invalid || authService.isLoading()"
                >
                  <ng-container *ngIf="authService.isLoading(); else registerContent">
                    <mat-spinner diameter="20" class="button-spinner"></mat-spinner>
                    Creando cuenta...
                  </ng-container>
                  <ng-template #registerContent>
                    <mat-icon>person_add</mat-icon>
                    Crear Cuenta
                  </ng-template>
                </button>
              </div>
            </form>
          </mat-card-content>

          <mat-card-actions class="register-actions">
            <div class="login-link">
              <span>¿Ya tienes cuenta?</span>
              <a routerLink="/auth/login" mat-button color="accent">
                Inicia sesión aquí
              </a>
            </div>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .register-card-wrapper {
      width: 100%;
      max-width: 500px;
    }

    .register-card {
      padding: 24px;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    .register-header {
      text-align: center;
      margin-bottom: 24px;
    }

    .register-header mat-card-title {
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

    .register-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-section {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0;
      font-size: 16px;
      font-weight: 500;
      color: #333;
      border-bottom: 1px solid #e0e0e0;
      padding-bottom: 8px;
    }

    .form-row {
      display: flex;
      gap: 16px;
    }

    .full-width {
      width: 100%;
    }

    .half-width {
      flex: 1;
    }

    .form-actions {
      margin-top: 16px;
    }

    .register-button {
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

    .register-actions {
      margin-top: 16px;
      display: flex;
      justify-content: center;
    }

    .login-link {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
    }

    @media (max-width: 480px) {
      .register-container {
        padding: 16px;
      }
      
      .register-card {
        padding: 20px;
      }

      .form-row {
        flex-direction: column;
        gap: 16px;
      }

      .half-width {
        width: 100%;
      }
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  hidePassword = signal(true);
  hideConfirmPassword = signal(true);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    public authService: AuthService
  ) {
    this.registerForm = this.createForm();
    
    // Si ya está autenticado, redirigir al dashboard
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      username: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(/^[a-zA-Z0-9_]+$/)
      ]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^\+?[0-9\s\-\(\)]+$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(control: AbstractControl): {[key: string]: boolean} | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { 'passwordMismatch': true };
    }
    return null;
  }

  togglePassword(): void {
    this.hidePassword.update(value => !value);
  }

  toggleConfirmPassword(): void {
    this.hideConfirmPassword.update(value => !value);
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const { confirmPassword, ...registerData } = this.registerForm.value;
      const userData: RegisterRequest = registerData;
      
      this.authService.register(userData).subscribe({
        next: (response) => {
          this.showSuccess('¡Cuenta creada exitosamente! Bienvenido.');
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Error en registro:', error);
          let errorMessage = 'Error al crear la cuenta. Intenta nuevamente.';
          
          if (error.status === 409) {
            errorMessage = 'El usuario o email ya está registrado.';
          } else if (error.status === 400) {
            errorMessage = 'Datos inválidos. Verifica la información ingresada.';
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
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
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