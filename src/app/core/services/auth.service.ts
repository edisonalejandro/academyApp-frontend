import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { 
  LoginRequest,
  RegisterRequest,
  JwtResponse,
  LogoutResponse
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = `${environment.apiUrl}/auth`;
  
  // Signals para estado reactivo
  private currentUserSignal = signal<JwtResponse | null>(null);
  private isAuthenticatedSignal = signal<boolean>(false);
  private isLoadingSignal = signal<boolean>(false);
  
  // Computed properties
  public currentUser = this.currentUserSignal.asReadonly();
  public isAuthenticated = this.isAuthenticatedSignal.asReadonly();
  public isLoading = this.isLoadingSignal.asReadonly();
  
  // Computed para roles (formato ROLE_XXX según la API)
  public userRoles = computed(() => this.currentUserSignal()?.roles || []);
  public isAdmin = computed(() => this.userRoles().includes('ROLE_ADMIN'));
  public isTeacher = computed(() => 
    this.userRoles().includes('ROLE_TEACHER') || this.isAdmin()
  );
  public isStudent = computed(() => this.userRoles().includes('ROLE_STUDENT'));
  
  // Información del usuario
  public userId = computed(() => this.currentUserSignal()?.id);
  public userEmail = computed(() => this.currentUserSignal()?.email);
  public userName = computed(() => {
    const user = this.currentUserSignal();
    return user ? `${user.firstName} ${user.lastName}` : '';
  });

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.initializeAuth();
  }

  /**
   * Inicializar autenticación al cargar la app
   */
  private initializeAuth(): void {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem(environment.tokenKey);
      const userDataStr = localStorage.getItem('academy_user');
      
      if (token && userDataStr) {
        try {
          const userData = JSON.parse(userDataStr) as JwtResponse;
          this.currentUserSignal.set(userData);
          this.isAuthenticatedSignal.set(true);
        } catch (error) {
          console.error('Error parsing user data:', error);
          this.clearAuth();
        }
      }
    }
  }

  /**
   * Iniciar sesión
   */
  login(credentials: LoginRequest): Observable<JwtResponse> {
    this.isLoadingSignal.set(true);
    
    return this.http.post<JwtResponse>(`${this.baseUrl}/login`, credentials).pipe(
      tap(response => {
        this.saveAuth(response);
        this.isLoadingSignal.set(false);
      }),
      catchError(error => {
        this.isLoadingSignal.set(false);
        return throwError(() => error);
      })
    );
  }

  /**
   * Registrar nuevo usuario
   */
  register(userData: RegisterRequest): Observable<JwtResponse> {
    this.isLoadingSignal.set(true);
    
    return this.http.post<JwtResponse>(`${this.baseUrl}/register`, userData).pipe(
      tap(response => {
        this.saveAuth(response);
        this.isLoadingSignal.set(false);
      }),
      catchError(error => {
        this.isLoadingSignal.set(false);
        return throwError(() => error);
      })
    );
  }

  /**
   * Cerrar sesión
   */
  logout(): Observable<LogoutResponse> {
    return this.http.post<LogoutResponse>(`${this.baseUrl}/logout`, {}).pipe(
      tap(() => {
        this.clearAuth();
        this.router.navigate(['/auth/login']);
      }),
      catchError(error => {
        // Incluso si falla el logout en el servidor, limpiar el cliente
        this.clearAuth();
        this.router.navigate(['/auth/login']);
        return throwError(() => error);
      })
    );
  }

  /**
   * Cerrar sesión local (sin llamar al servidor)
   */
  logoutLocal(): void {
    this.clearAuth();
    this.router.navigate(['/auth/login']);
  }

  /**
   * Guardar datos de autenticación
   */
  private saveAuth(response: JwtResponse): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(environment.tokenKey, response.token);
      localStorage.setItem('academy_user', JSON.stringify(response));
    }
    this.currentUserSignal.set(response);
    this.isAuthenticatedSignal.set(true);
  }

  /**
   * Limpiar datos de autenticación
   */
  private clearAuth(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(environment.tokenKey);
      localStorage.removeItem('academy_user');
    }
    this.currentUserSignal.set(null);
    this.isAuthenticatedSignal.set(false);
  }

  /**
   * Obtener el token actual
   */
  getToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(environment.tokenKey);
    }
    return null;
  }

  /**
   * Verificar si el token ha expirado (duración: 24 horas)
   * Nota: Esto es una verificación básica, idealmente deberías decodificar el JWT
   */
  isTokenExpired(): boolean {
    // Simplemente verificar si existe el token
    // Para una implementación completa, deberías usar una librería como jwt-decode
    return !this.getToken();
  }
}
