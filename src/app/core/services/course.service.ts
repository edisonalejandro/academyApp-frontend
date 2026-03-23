import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CourseDTO, CreateCourseDTO, UpdateCourseDTO, CourseCapacityResponse, DanceType, DanceLevel } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/courses`;

  /**
   * Obtiene todos los cursos activos (público)
   */
  getCourses(): Observable<CourseDTO[]> {
    return this.http.get<CourseDTO[]>(this.apiUrl);
  }

  /**
   * Obtiene todos los cursos (incluye inactivos) - requiere ADMIN
   */
  getAllCourses(): Observable<CourseDTO[]> {
    return this.http.get<CourseDTO[]>(`${this.apiUrl}/all`);
  }

  /**
   * Obtiene un curso por ID (público)
   */
  getCourseById(id: number): Observable<CourseDTO> {
    return this.http.get<CourseDTO>(`${this.apiUrl}/${id}`);
  }

  /**
   * Busca cursos por texto (título, código, descripción) - público
   */
  searchCourses(query: string): Observable<CourseDTO[]> {
    const params = new HttpParams().set('q', query);
    return this.http.get<CourseDTO[]>(`${this.apiUrl}/search`, { params });
  }

  /**
   * Obtiene cursos por tipo de baile (público)
   */
  getCoursesByDanceType(danceType: DanceType): Observable<CourseDTO[]> {
    return this.http.get<CourseDTO[]>(`${this.apiUrl}/dance-type/${danceType}`);
  }

  /**
   * Obtiene cursos por nivel (público)
   */
  getCoursesByLevel(level: DanceLevel): Observable<CourseDTO[]> {
    return this.http.get<CourseDTO[]>(`${this.apiUrl}/level/${level}`);
  }

  /**
   * Obtiene cursos de un profesor - requiere ADMIN o TEACHER
   */
  getCoursesByTeacher(teacherId: number): Observable<CourseDTO[]> {
    return this.http.get<CourseDTO[]>(`${this.apiUrl}/teacher/${teacherId}`);
  }

  /**
   * Obtiene cupos disponibles de un curso (público)
   */
  getCourseCapacity(id: number): Observable<CourseCapacityResponse> {
    return this.http.get<CourseCapacityResponse>(`${this.apiUrl}/${id}/capacity`);
  }

  /**
   * Crea un curso - requiere ADMIN
   */
  createCourse(course: CreateCourseDTO): Observable<CourseDTO> {
    return this.http.post<CourseDTO>(this.apiUrl, course);
  }

  /**
   * Actualiza un curso completo - requiere ADMIN
   */
  updateCourse(id: number, course: UpdateCourseDTO): Observable<CourseDTO> {
    return this.http.put<CourseDTO>(`${this.apiUrl}/${id}`, course);
  }

  /**
   * Elimina un curso (eliminación lógica) - requiere ADMIN
   */
  deleteCourse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Activa o desactiva un curso - requiere ADMIN
   */
  toggleCourseStatus(id: number): Observable<CourseDTO> {
    return this.http.patch<CourseDTO>(`${this.apiUrl}/${id}/toggle-status`, {});
  }
}
