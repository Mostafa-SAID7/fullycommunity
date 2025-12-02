import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ModerationItem {
  id: string;
  contentId: string;
  contentType: string;
  contentTitle: string;
  reportReason: string;
  reportedBy: string;
  reportedAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'dismissed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  moderatorId?: string;
  moderatedAt?: string;
  moderatorNotes?: string;
}

export interface ModerationListResponse {
  items: ModerationItem[];
  totalCount: number;
  pendingCount: number;
}

export interface ModerationStats {
  pendingReports: number;
  resolvedToday: number;
  resolvedThisWeek: number;
  totalReports: number;
}

@Injectable({ providedIn: 'root' })
export class AdminModerationService {
  private apiUrl = `${environment.apiUrl}/api/admin/dashboard/community`;

  constructor(private http: HttpClient) {}

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
    return this.http.post<void>(`${this.apiUrl}/moderation/${id}/approve`, { notes });
  }

  rejectItem(id: string, reason: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/moderation/${id}/reject`, { reason });
  }

  deleteContent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/moderation/${id}/content`);
  }

  dismissItem(id: string, notes?: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/moderation/${id}/dismiss`, { notes });
  }

  banUser(userId: string, reason: string, duration?: number): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/api/admin/dashboard/users/admin-users/${userId}/ban`, { 
      reason, 
      durationDays: duration 
    });
  }
}
