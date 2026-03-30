import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserDTO, PageResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly baseUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  /**
   * GET /api/users - Obtener todos los usuarios con paginación
   * Roles: ADMIN, TEACHER
   */
  getAllUsers(page = 0, size = 50): Observable<PageResponse<UserDTO>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<PageResponse<UserDTO>>(this.baseUrl, { params });
  }

  /**
   * GET /api/users/{id} - Obtener usuario por ID
   * Roles: ADMIN, TEACHER, propio usuario
   */
  getUserById(id: number): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.baseUrl}/${id}`);
  }

  /**
   * GET /api/users/email/{email} - Obtener usuario por email
   * Roles: ADMIN, TEACHER, propio usuario
   */
  getUserByEmail(email: string): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.baseUrl}/email/${email}`);
  }

  /**
   * GET /api/users/active - Obtener solo usuarios activos
   * Roles: ADMIN, TEACHER
   */
  getActiveUsers(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(`${this.baseUrl}/active`);
  }

  /**
   * GET /api/users/search?name=... - Buscar usuarios por nombre
   * Roles: ADMIN, TEACHER
   */
  searchUsersByName(name: string): Observable<UserDTO[]> {
    const params = new HttpParams().set('name', name);
    return this.http.get<UserDTO[]>(`${this.baseUrl}/search`, { params });
  }

  /**
   * POST /api/users - Crear nuevo usuario
   * Roles: ADMIN
   */
  createUser(user: Partial<UserDTO>): Observable<UserDTO> {
    return this.http.post<UserDTO>(this.baseUrl, user);
  }

  /**
   * PUT /api/users/{id} - Actualizar usuario
   * Roles: ADMIN, propio usuario
   */
  updateUser(id: number, user: Partial<UserDTO>): Observable<UserDTO> {
    return this.http.put<UserDTO>(`${this.baseUrl}/${id}`, user);
  }

  /**
   * DELETE /api/users/{id} - Eliminar usuario
   * Roles: ADMIN
   */
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  /**
   * PATCH /api/users/{id}/toggle-status - Activar/Desactivar usuario
   * Roles: ADMIN
   */
  toggleUserStatus(id: number): Observable<UserDTO> {
    return this.http.patch<UserDTO>(`${this.baseUrl}/${id}/toggle-status`, {});
  }
}
