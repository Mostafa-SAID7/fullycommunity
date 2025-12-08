import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  AdminUser,
  UserListResponse,
  CreateUserRequest,
  UpdateUserRequest,
  AssignRoleRequest
} from '../../interfaces/admin/users.interface';

@Injectable({ providedIn: 'root' })
export class AdminUsersService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/admin/dashboard/users`;

  getUsers(page = 1, pageSize = 10, search?: string, role?: string, status?: string): Observable<UserListResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    
    if (search) params = params.set('search', search);
    if (role) params = params.set('role', role);
    if (status) params = params.set('status', status);

    return this.http.get<UserListResponse>(`${this.apiUrl}/admin-users`, { params });
  }

  getUser(id: string): Observable<AdminUser> {
    return this.http.get<AdminUser>(`${this.apiUrl}/admin-users/${id}`);
  }

  createUser(request: CreateUserRequest): Observable<AdminUser> {
    return this.http.post<AdminUser>(`${environment.apiUrl}/api/auth/create-admin`, request);
  }

  updateUser(id: string, request: UpdateUserRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/admin-users/${id}`, request);
  }

  activateUser(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/admin-users/${id}/activate`, {});
  }

  blockUser(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/admin-users/${id}/block`, {});
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin-users/${id}`);
  }

  assignRole(userId: string, role: string): Observable<void> {
    const request: AssignRoleRequest = { role };
    return this.http.post<void>(`${this.apiUrl}/admin-users/${userId}/roles`, request);
  }

  removeRole(userId: string, role: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin-users/${userId}/roles/${role}`);
  }

  getRoles(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/roles`);
  }
}
