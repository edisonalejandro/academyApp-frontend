import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  
  // Obtener token del localStorage
  const token = localStorage.getItem(environment.tokenKey);
  
  // Si existe token, agregarlo a los headers
  if (token && req.url.startsWith(environment.apiUrl)) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }
  
  // Manejar la respuesta
  return next(req).pipe(
    catchError((error) => {
      // Si es error 401 (No autorizado), redirigir al login
      if (error.status === 401) {
        localStorage.removeItem(environment.tokenKey);
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