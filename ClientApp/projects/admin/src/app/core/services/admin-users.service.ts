import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userName: string;
  phoneNumber?: string;
  accountStatus: string;
  roles: string[];
  createdAt: string;
  lastLoginAt?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
}

export interface UserListResponse {
  items: AdminUser[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roleType?: string;
  permissions?: string[];
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  accountStatus?: string;
}

@Injectable({ providedIn: 'root' })
export class AdminUsersService {
  private apiUrl = `${environment.apiUrl}/api/admin/dashboard/users`;

  constructor(private http: HttpClient) {}

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
    return this.http.post<void>(`${this.apiUrl}/admin-users/${userId}/roles`, { role });
  }

  removeRole(userId: string, role: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin-users/${userId}/roles/${role}`);
  }

  getRoles(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/roles`);
  }
}
