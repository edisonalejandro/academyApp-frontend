import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StudentDTO, StudentCategory, StudentStatus, StudentCategoryUpdateRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/students`;

  /**
   * Obtiene todos los estudiantes - requiere ADMIN o TEACHER
   */
  getAllStudents(): Observable<StudentDTO[]> {
    return this.http.get<StudentDTO[]>(this.apiUrl);
  }

  /**
   * Obtiene un estudiante por ID - requiere ADMIN o TEACHER
   */
  getStudentById(id: number): Observable<StudentDTO> {
    return this.http.get<StudentDTO>(`${this.apiUrl}/${id}`);
  }

  /**
   * Obtiene el perfil propio del estudiante - requiere autenticación
   */
  getMyProfile(): Observable<StudentDTO> {
    return this.http.get<StudentDTO>(`${this.apiUrl}/me`);
  }

  /**
   * Busca estudiantes por nombre, email o teléfono - requiere ADMIN o TEACHER
   */
  searchStudents(query: string): Observable<StudentDTO[]> {
    const params = new HttpParams().set('q', query);
    return this.http.get<StudentDTO[]>(`${this.apiUrl}/search`, { params });
  }

  /**
   * Obtiene estudiantes por estado - requiere ADMIN o TEACHER
   */
  getStudentsByStatus(status: StudentStatus): Observable<StudentDTO[]> {
    return this.http.get<StudentDTO[]>(`${this.apiUrl}/status/${status}`);
  }

  /**
   * Obtiene estudiantes por categoría - requiere ADMIN o TEACHER
   */
  getStudentsByCategory(category: StudentCategory): Observable<StudentDTO[]> {
    return this.http.get<StudentDTO[]>(`${this.apiUrl}/category/${category}`);
  }

  /**
   * Crea un estudiante - requiere ADMIN
   */
  createStudent(student: StudentDTO): Observable<StudentDTO> {
    return this.http.post<StudentDTO>(this.apiUrl, student);
  }

  /**
   * Actualiza datos completos de un estudiante - requiere ADMIN
   */
  updateStudent(id: number, student: StudentDTO): Observable<StudentDTO> {
    return this.http.put<StudentDTO>(`${this.apiUrl}/${id}`, student);
  }

  /**
   * Cambia la categoría de un estudiante - requiere ADMIN
   */
  updateStudentCategory(id: number, category: StudentCategory): Observable<StudentDTO> {
    const request: StudentCategoryUpdateRequest = { category };
    return this.http.patch<StudentDTO>(`${this.apiUrl}/${id}/category`, request);
  }
}
