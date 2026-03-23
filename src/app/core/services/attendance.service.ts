import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AttendanceDTO,
  AttendanceCreateRequest,
  AttendanceUpdateRequest,
  AttendanceRateResponse,
  AttendanceCheckResponse,
  AttendanceReportResponse,
  LowAttendanceStudent
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/attendances`;

  /**
   * Registra asistencia - requiere ADMIN o TEACHER
   * Si ya existe un registro para studentId + classSessionId, lo actualiza (idempotente)
   */
  createAttendance(request: AttendanceCreateRequest): Observable<AttendanceDTO> {
    return this.http.post<AttendanceDTO>(this.apiUrl, request);
  }

  /**
   * Actualiza estado de asistencia - requiere ADMIN o TEACHER
   */
  updateAttendance(id: number, request: AttendanceUpdateRequest): Observable<AttendanceDTO> {
    return this.http.put<AttendanceDTO>(`${this.apiUrl}/${id}`, request);
  }

  /**
   * Obtiene asistencias de una sesión - requiere ADMIN o TEACHER
   */
  getAttendancesBySession(sessionId: number): Observable<AttendanceDTO[]> {
    return this.http.get<AttendanceDTO[]>(`${this.apiUrl}/session/${sessionId}`);
  }

  /**
   * Obtiene historial de asistencias de un estudiante - requiere ADMIN o TEACHER
   */
  getAttendancesByStudent(studentId: number): Observable<AttendanceDTO[]> {
    return this.http.get<AttendanceDTO[]>(`${this.apiUrl}/student/${studentId}`);
  }

  /**
   * Obtiene porcentaje de asistencia de un estudiante - requiere ADMIN o TEACHER
   */
  getStudentAttendanceRate(studentId: number): Observable<AttendanceRateResponse> {
    return this.http.get<AttendanceRateResponse>(`${this.apiUrl}/student/${studentId}/rate`);
  }

  /**
   * Verifica si el estudiante tiene registro en una sesión - requiere ADMIN o TEACHER
   */
  checkStudentAttendance(studentId: number, classSessionId: number): Observable<AttendanceCheckResponse> {
    return this.http.get<AttendanceCheckResponse>(
      `${this.apiUrl}/student/${studentId}/check/${classSessionId}`
    );
  }

  /**
   * Obtiene reporte completo de asistencias - requiere ADMIN
   * @param from Fecha inicio en formato ISO 8601 (yyyy-MM-ddTHH:mm:ss)
   * @param to Fecha fin en formato ISO 8601 (yyyy-MM-ddTHH:mm:ss)
   */
  getAttendanceReport(from: string, to: string): Observable<AttendanceReportResponse> {
    const params = new HttpParams()
      .set('from', from)
      .set('to', to);
    return this.http.get<AttendanceReportResponse>(`${this.apiUrl}/report`, { params });
  }

  /**
   * Obtiene estudiantes con baja asistencia - requiere ADMIN o TEACHER
   * @param minPercentage Porcentaje mínimo (default: 75.0)
   */
  getLowAttendanceStudents(minPercentage: number = 75.0): Observable<LowAttendanceStudent[]> {
    const params = new HttpParams().set('minPercentage', minPercentage.toString());
    return this.http.get<LowAttendanceStudent[]>(`${this.apiUrl}/low-attendance`, { params });
  }
}
