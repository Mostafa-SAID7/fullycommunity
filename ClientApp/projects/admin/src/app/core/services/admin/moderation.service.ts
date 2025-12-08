import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  ModerationItem,
  ModerationListResponse,
  ModerationStats,
  ModerationActionRequest,
  BanUserRequest
} from '../../interfaces/admin/moderation.interface';

@Injectable({ providedIn: 'root' })
export class AdminModerationService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/admin/dashboard/community`;

  getModerationStats(): Observable<ModerationStats> {
    return this.http.get<ModerationStats>(`${this.apiUrl}/moderation/stats`);
  }

  getPendingItems(page = 1, pageSize = 20): Observable<ModerationListResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())
      .set('status', 'pending');
    return this.http.get<ModerationListResponse>(`${this.apiUrl}/moderation`, { params });
  }

  getAllItems(page = 1, pageSize = 20, status?: string): Observable<ModerationListResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    if (status) params = params.set('status', status);
    return this.http.get<ModerationListResponse>(`${this.apiUrl}/moderation`, { params });
  }

  approveItem(id: string, notes?: string): Observable<void> {
    const request: ModerationActionRequest = { notes };
    return this.http.post<void>(`${this.apiUrl}/moderation/${id}/approve`, request);
  }

  rejectItem(id: string, reason: string): Observable<void> {
    const request: ModerationActionRequest = { reason };
    return this.http.post<void>(`${this.apiUrl}/moderation/${id}/reject`, request);
  }

  deleteContent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/moderation/${id}/content`);
  }

  dismissItem(id: string, notes?: string): Observable<void> {
    const request: ModerationActionRequest = { notes };
    return this.http.post<void>(`${this.apiUrl}/moderation/${id}/dismiss`, request);
  }

  banUser(userId: string, reason: string, duration?: number): Observable<void> {
    const request: BanUserRequest = { 
      reason, 
      durationDays: duration 
    };
    return this.http.post<void>(`${environment.apiUrl}/api/admin/dashboard/users/admin-users/${userId}/ban`, request);
  }
}
