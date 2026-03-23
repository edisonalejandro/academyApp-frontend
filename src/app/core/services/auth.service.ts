import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { 
  User, 
  AuthRequest, 
  AuthResponse, 
  RegisterRequest,
  UserRole 
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = `${environment.apiUrl}/auth`;
  
  // Signals para estado reactivo
  private currentUserSignal = signal<User | null>(null);
  private isAuthenticatedSignal = signal<boolean>(false);
  private isLoadingSignal = signal<boolean>(false);
  
  // Computed properties
  public currentUser = this.currentUserSignal.asReadonly();
  public isAuthenticated = this.isAuthenticatedSignal.asReadonly();
  public isLoading = this.isLoadingSignal.asReadonly();
  
  // Computed para roles
  public userRoles = computed(() => this.currentUserSignal()?.roles || []);
  public isAdmin = computed(() => this.userRoles().includes(UserRole.ADMIN));
  public isTeacher = computed(() => 
    this.userRoles().includes(UserRole.TEACHER) || this.isAdmin()
  );
  public isStudent = computed(() => this.userRoles().includes(UserRole.STUDENT));

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
      if (token) {
        this.isLoadingSignal.set(true);
        this.getMyProfile().subscribe({
          next: (user) => {
            this.currentUserSignal.set(user);
            this.isAuthenticatedSignal.set(true);
            this.isLoadingSignal.set(false);
          },
          error: () => {
            this.logout();
            this.isLoadingSignal.set(false);
          }
        });
      }
    }
  }

  /**
   * Iniciar sesión
   */
  login(credentials: AuthRequest): Observable<AuthResponse> {
    this.isLoadingSignal.set(true);
    
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, credentials).pipe(
      tap(response => {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(environment.tokenKey, response.token);
        }
        this.currentUserSignal.set(response.user);
        this.isAuthenticatedSignal.set(true);
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
  register(userData: RegisterRequest): Observable<AuthResponse> {
    this.isLoadingSignal.set(true);
    
    return this.http.post<AuthResponse>(`${this.baseUrl}/register`, userData).pipe(
      tap(response => {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(environment.tokenKey, response.token);
        }
        this.currentUserSignal.set(response.user);
        this.isAuthenticatedSignal.set(true);
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
  logout(): void {
    let token: string | null = null;
    if (typeof localStorage !== 'undefined') {
      token = localStorage.getItem(environment.tokenKey);
    }
    if (token) {
      // Llamar al endpoint de logout del backend
      this.http.post(`${this.baseUrl}/logout`, {}).subscribe({
        complete: () => {
          this.clearAuthState();
          this.router.navigate(['/auth/login']);
        },
        error: () => {
          // Limpiar estado local aunque falle el logout en el servidor
          this.clearAuthState();
          this.router.navigate(['/auth/login']);
        }
      });
    } else {
      this.clearAuthState();
      this.router.navigate(['/auth/login']);
    }
  }

  /**
   * Obtener perfil del usuario actual
   */
  getMyProfile(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/users/me`);
  }

  /**
   * Limpiar estado de autenticación
   */
  private clearAuthState(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(environment.tokenKey);
    }
    this.currentUserSignal.set(null);
    this.isAuthenticatedSignal.set(false);
  }

  /**
   * Verificar si el usuario tiene un rol específico
   */
  hasRole(role: UserRole): boolean {
    return this.userRoles().includes(role);
  }

  /**
   * Verificar si el usuario tiene alguno de los roles especificados
   */
  hasAnyRole(roles: UserRole[]): boolean {
    const userRoles = this.userRoles();
    return roles.some(role => userRoles.includes(role));
  }

  /**
   * Verificar si el token es válido (sin hacer llamada al servidor)
   */
  isTokenValid(): boolean {
    if (typeof localStorage === 'undefined') return false;
    const token = localStorage.getItem(environment.tokenKey);
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Date.now() / 1000;
      return payload.exp > now;
    } catch {
      return false;
    }
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
}