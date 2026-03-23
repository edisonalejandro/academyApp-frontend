import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ClassSessionDTO, ClassSessionCancelRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ClassSessionService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/class-sessions`;

  /**
   * Obtiene todas las sesiones de un curso - requiere autenticación
   */
  getSessionsByCourse(courseId: number): Observable<ClassSessionDTO[]> {
    return this.http.get<ClassSessionDTO[]>(`${this.apiUrl}/course/${courseId}`);
  }

  /**
   * Obtiene una sesión por ID - requiere autenticación
   */
  getSessionById(id: number): Observable<ClassSessionDTO> {
    return this.http.get<ClassSessionDTO>(`${this.apiUrl}/${id}`);
  }

  /**
   * Obtiene próximas sesiones programadas de un curso - requiere autenticación
   */
  getUpcomingSessions(courseId: number): Observable<ClassSessionDTO[]> {
    return this.http.get<ClassSessionDTO[]>(`${this.apiUrl}/upcoming/${courseId}`);
  }

  /**
   * Obtiene sesiones en rango de fechas (calendario) - requiere autenticación
   * @param from Fecha inicio en formato ISO 8601 (yyyy-MM-ddTHH:mm:ss)
   * @param to Fecha fin en formato ISO 8601 (yyyy-MM-ddTHH:mm:ss)
   */
  getCalendarSessions(from: string, to: string): Observable<ClassSessionDTO[]> {
    const params = new HttpParams()
      .set('from', from)
      .set('to', to);
    return this.http.get<ClassSessionDTO[]>(`${this.apiUrl}/calendar`, { params });
  }

  /**
   * Obtiene sesiones de un profesor - requiere ADMIN o TEACHER
   */
  getSessionsByTeacher(teacherId: number): Observable<ClassSessionDTO[]> {
    return this.http.get<ClassSessionDTO[]>(`${this.apiUrl}/teacher/${teacherId}`);
  }

  /**
   * Obtiene todas las sesiones - requiere ADMIN o TEACHER
   */
  getAllSessions(): Observable<ClassSessionDTO[]> {
    return this.http.get<ClassSessionDTO[]>(this.apiUrl);
  }

  /**
   * Crea una sesión - requiere ADMIN o TEACHER
   */
  createSession(session: ClassSessionDTO): Observable<ClassSessionDTO> {
    return this.http.post<ClassSessionDTO>(this.apiUrl, session);
  }

  /**
   * Actualiza una sesión - requiere ADMIN o TEACHER
   */
  updateSession(id: number, session: ClassSessionDTO): Observable<ClassSessionDTO> {
    return this.http.put<ClassSessionDTO>(`${this.apiUrl}/${id}`, session);
  }

  /**
   * Cancela una sesión - requiere ADMIN o TEACHER
   */
  cancelSession(id: number, request?: ClassSessionCancelRequest): Observable<ClassSessionDTO> {
    return this.http.patch<ClassSessionDTO>(`${this.apiUrl}/${id}/cancel`, request || {});
  }

  /**
   * Marca sesión como iniciada - requiere ADMIN o TEACHER
   * Pone la sesión en IN_PROGRESS y registra actualStartTime
   */
  startSession(id: number): Observable<ClassSessionDTO> {
    return this.http.patch<ClassSessionDTO>(`${this.apiUrl}/${id}/start`, {});
  }

  /**
   * Marca sesión como completada - requiere ADMIN o TEACHER
   * Pone la sesión en COMPLETED, registra actualEndTime y calcula actualDuration
   */
  completeSession(id: number): Observable<ClassSessionDTO> {
    return this.http.patch<ClassSessionDTO>(`${this.apiUrl}/${id}/complete`, {});
  }
}
