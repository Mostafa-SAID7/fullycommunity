/**
 * Admin Users Service
 * Service for user management operations
 */

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  AdminUser,
  UserListResponse,
  UserStats
} from '../../interfaces/admin/users.interface';

@Injectable({ providedIn: 'root' })
export class AdminUsersService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/admin/users`;

  getUsers(page = 1, pageSize = 20, search?: string, role?: string, status?: string): Observable<UserListResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    
    if (search) params = params.set('search', search);
    if (role) params = params.set('role', role);
    if (status) params = params.set('status', status);

    return this.http.get<UserListResponse>(this.apiUrl, { params });
  }

  getUserStats(): Observable<UserStats> {
    return this.http.get<UserStats>(`${this.apiUrl}/stats`);
  }

  getUser(id: string): Observable<AdminUser> {
    return this.http.get<AdminUser>(`${this.apiUrl}/${id}`);
  }

  updateUser(id: string, user: Partial<AdminUser>): Observable<AdminUser> {
    return this.http.put<AdminUser>(`${this.apiUrl}/${id}`, user);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  suspendUser(id: string, reason: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/suspend`, { reason });
  }

  unsuspendUser(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/unsuspend`, {});
  }

  verifyUser(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/verify`, {});
  }

  activateUser(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/activate`, {});
  }

  blockUser(id: string, reason: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/block`, { reason });
  }

  createUser(user: Partial<AdminUser>): Observable<AdminUser> {
    return this.http.post<AdminUser>(this.apiUrl, user);
  }
}