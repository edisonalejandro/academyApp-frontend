import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserDTO } from '../models';

export interface RoleDTO {
  id: number;
  name: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private readonly baseUrl = `${environment.apiUrl}/roles`;

  constructor(private http: HttpClient) {}

  /**
   * GET /api/roles - Obtener todos los roles
   * Roles: ADMIN
   */
  getAllRoles(): Observable<RoleDTO[]> {
    return this.http.get<RoleDTO[]>(this.baseUrl);
  }

  /**
   * GET /api/roles/{id} - Obtener rol por ID
   * Roles: ADMIN
   */
  getRoleById(id: number): Observable<RoleDTO> {
    return this.http.get<RoleDTO>(`${this.baseUrl}/${id}`);
  }

  /**
   * GET /api/roles/user/{userId} - Obtener roles de un usuario
   * Roles: ADMIN, propio usuario
   */
  getUserRoles(userId: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/user/${userId}`);
  }

  /**
   * GET /api/roles/users/{roleName} - Obtener usuarios por rol
   * Roles: ADMIN, TEACHER
   */
  getUsersByRole(roleName: string): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(`${this.baseUrl}/users/${roleName}`);
  }

  /**
   * POST /api/roles/assign/{userId}?roleName=ADMIN - Asignar rol
   * Roles: ADMIN
   */
  assignRole(userId: number, roleName: string): Observable<UserDTO> {
    const params = new HttpParams().set('roleName', roleName);
    return this.http.post<UserDTO>(`${this.baseUrl}/assign/${userId}`, null, { params });
  }

  /**
   * POST /api/roles/remove/{userId}?roleName=ADMIN - Remover rol
   * Roles: ADMIN
   */
  removeRole(userId: number, roleName: string): Observable<UserDTO> {
    const params = new HttpParams().set('roleName', roleName);
    return this.http.post<UserDTO>(`${this.baseUrl}/remove/${userId}`, null, { params });
  }
}
