import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  
  // Obtener token del localStorage solo si estamos en el navegador
  let token: string | null = null;
  if (isPlatformBrowser(platformId)) {
    token = localStorage.getItem(environment.tokenKey);
  }
  
  // Si existe token, agregarlo a los headers
  if (token && req.url.startsWith(environment.apiUrl)) {
    const headers: { [key: string]: string } = {
      Authorization: `Bearer ${token}`
    };
    
    // Solo agregar Content-Type para peticiones que no sean GET
    if (req.method !== 'GET') {
      headers['Content-Type'] = 'application/json';
    }
    
    req = req.clone({
      setHeaders: headers
    });
  }
  
  // Manejar la respuesta
  return next(req).pipe(
    catchError((error) => {
      // Si es error 401 (No autorizado), redirigir al login
      if (error.status === 401) {
        if (isPlatformBrowser(platformId)) {
          localStorage.removeItem(environment.tokenKey);
        }
        router.navigate(['/auth/login']);
      }
      
      // Si es error 403 (Prohibido), mostrar mensaje de acceso denegado
      if (error.status === 403) {
        console.error('Acceso denegado: No tienes permisos para realizar esta acción');
        // Aquí puedes agregar un servicio de notificaciones
      }
      
      return throwError(() => error);
    })
  );
};