import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  AdminUser,
  UserFilter,
  UserAction,
  BulkUserAction,
  UserStatistics
} from '../../interfaces/admin/user-management.interface';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  private readonly apiUrl = `${environment.apiUrl}/admin/users`;

  constructor(private http: HttpClient) {}

  /**
   * Get users with filtering and pagination
   */
  getUsers(filter: UserFilter, page: number = 1, pageSize: number = 20): Observable<{ users: AdminUser[], total: number }> {
    let params = new HttpParams();
    params = params.set('page', page.toString());
    params = params.set('pageSize', pageSize.toString());
    
    if (filter.search) params = params.set('search', filter.search);
    if (filter.status !== null && filter.status !== undefined) params = params.set('status', filter.status.toString());
    if (filter.verificationStatus !== null && filter.verificationStatus !== undefined) params = params.set('verificationStatus', filter.verificationStatus.toString());
    if (filter.userType) params = params.set('userType', filter.userType);
    if (filter.role) params = params.set('role', filter.role);
    if (filter.dateFrom) params = params.set('dateFrom', filter.dateFrom);
    if (filter.dateTo) params = params.set('dateTo', filter.dateTo);
    if (filter.isVerified !== null && filter.isVerified !== undefined) params = params.set('isVerified', filter.isVerified.toString());
    if (filter.hasWarnings !== null && filter.hasWarnings !== undefined) params = params.set('hasWarnings', filter.hasWarnings.toString());
    
    return this.http.get<{ users: AdminUser[], total: number }>(this.apiUrl, { params });
  }

  /**
   * Get user by ID
   */
  getUser(userId: string): Observable<AdminUser> {
    return this.http.get<AdminUser>(`${this.apiUrl}/${userId}`);
  }

  /**
   * Create user
   */
  createUser(user: Partial<AdminUser>): Observable<AdminUser> {
    return this.http.post<AdminUser>(this.apiUrl, user);
  }

  /**
   * Update user
   */
  updateUser(userId: string, user: Partial<AdminUser>): Observable<AdminUser> {
    return this.http.put<AdminUser>(`${this.apiUrl}/${userId}`, user);
  }

  /**
   * Perform user action
   */
  performUserAction(action: UserAction): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/action`, action);
  }

  /**
   * Perform bulk user action
   */
  performBulkAction(action: BulkUserAction): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/bulk-action`, action);
  }

  /**
   * Get user statistics
   */
  getUserStatistics(): Observable<UserStatistics> {
    return this.http.get<UserStatistics>(`${this.apiUrl}/statistics`);
  }

  /**
   * Export users
   */
  exportUsers(filter: UserFilter, format: string = 'csv'): Observable<Blob> {
    let params = new HttpParams();
    params = params.set('format', format);
    
    if (filter.search) params = params.set('search', filter.search);
    if (filter.status !== null && filter.status !== undefined) params = params.set('status', filter.status.toString());
    if (filter.verificationStatus !== null && filter.verificationStatus !== undefined) params = params.set('verificationStatus', filter.verificationStatus.toString());
    if (filter.userType) params = params.set('userType', filter.userType);
    if (filter.role) params = params.set('role', filter.role);
    if (filter.dateFrom) params = params.set('dateFrom', filter.dateFrom);
    if (filter.dateTo) params = params.set('dateTo', filter.dateTo);
    
    return this.http.get(`${this.apiUrl}/export`, {
      params,
      responseType: 'blob'
    });
  }

  /**
   * Get user activity log
   */
  getUserActivityLog(userId: string, page: number = 1, pageSize: number = 20): Observable<any> {
    return this.http.get(`${this.apiUrl}/${userId}/activity`, {
      params: {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    });
  }

  /**
   * Get user login history
   */
  getUserLoginHistory(userId: string, page: number = 1, pageSize: number = 20): Observable<any> {
    return this.http.get(`${this.apiUrl}/${userId}/login-history`, {
      params: {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    });
  }

  /**
   * Impersonate user
   */
  impersonateUser(userId: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/${userId}/impersonate`, {});
  }

  /**
   * Send notification to user
   */
  sendNotification(userId: string, notification: { title: string, message: string, type: string }): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${userId}/notify`, notification);
  }
}