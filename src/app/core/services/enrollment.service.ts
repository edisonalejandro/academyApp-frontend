import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EnrollmentDTO, EnrollmentSummaryResponse, EnrollmentCancelRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/enrollments`;

  /**
   * Obtiene todas las inscripciones del usuario autenticado
   */
  getMyEnrollments(): Observable<EnrollmentDTO[]> {
    return this.http.get<EnrollmentDTO[]>(`${this.apiUrl}/my`);
  }

  /**
   * Obtiene solo las inscripciones activas del usuario autenticado
   */
  getMyActiveEnrollments(): Observable<EnrollmentDTO[]> {
    return this.http.get<EnrollmentDTO[]>(`${this.apiUrl}/my/active`);
  }

  /**
   * Obtiene el resumen de horas compradas/usadas del usuario autenticado
   */
  getMySummary(): Observable<EnrollmentSummaryResponse> {
    return this.http.get<EnrollmentSummaryResponse>(`${this.apiUrl}/my/summary`);
  }

  /**
   * Obtiene una inscripción por ID - requiere ADMIN o TEACHER
   */
  getEnrollmentById(id: number): Observable<EnrollmentDTO> {
    return this.http.get<EnrollmentDTO>(`${this.apiUrl}/${id}`);
  }

  /**
   * Obtiene todas las inscripciones de un curso - requiere ADMIN o TEACHER
   */
  getEnrollmentsByCourse(courseId: number): Observable<EnrollmentDTO[]> {
    return this.http.get<EnrollmentDTO[]>(`${this.apiUrl}/course/${courseId}`);
  }

  /**
   * Cancela una inscripción - requiere ADMIN
   */
  cancelEnrollment(id: number, request?: EnrollmentCancelRequest): Observable<EnrollmentDTO> {
    return this.http.patch<EnrollmentDTO>(`${this.apiUrl}/${id}/cancel`, request || {});
  }

  /**
   * Suspende una inscripción - requiere ADMIN
   */
  suspendEnrollment(id: number): Observable<EnrollmentDTO> {
    return this.http.patch<EnrollmentDTO>(`${this.apiUrl}/${id}/suspend`, {});
  }

  /**
   * Reactiva una inscripción suspendida - requiere ADMIN
   */
  reactivateEnrollment(id: number): Observable<EnrollmentDTO> {
    return this.http.patch<EnrollmentDTO>(`${this.apiUrl}/${id}/reactivate`, {});
  }
}
