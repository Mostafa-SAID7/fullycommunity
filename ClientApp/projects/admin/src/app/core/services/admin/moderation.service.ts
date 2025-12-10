import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface ModerationItem {
  id: string;
  contentId: string;
  contentType: 'post' | 'comment' | 'review' | 'video' | 'guide';
  contentTitle: string;
  contentPreview: string;
  reportReason: string;
  reporterId: string;
  reporterName: string;
  reportedAt: Date;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'pending' | 'approved' | 'rejected' | 'dismissed';
  moderatorId?: string;
  moderatorNotes?: string;
  resolvedAt?: Date;
}

export interface ModerationStats {
  pendingReports: number;
  resolvedToday: number;
  resolvedThisWeek: number;
  totalReports: number;
  averageResolutionTime: number;
}

export interface ModerationResponse {
  items: ModerationItem[];
  totalCount: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminModerationService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/api/admin/moderation`;

  getModerationStats(): Observable<ModerationStats> {
    // Mock data for development
    return of({
      pendingReports: 12,
      resolvedToday: 8,
      resolvedThisWeek: 45,
      totalReports: 234,
      averageResolutionTime: 2.5
    });
  }

  getPendingItems(): Observable<ModerationResponse> {
    // Mock data for development
    const mockItems: ModerationItem[] = [
      {
        id: '1',
        contentId: 'post-123',
        contentType: 'post',
        contentTitle: 'Best car maintenance tips',
        contentPreview: 'Here are some great tips for maintaining your car...',
        reportReason: 'Spam content',
        reporterId: 'user-456',
        reporterName: 'John Doe',
        reportedAt: new Date(Date.now() - 3600000),
        priority: 'normal',
        status: 'pending'
      },
      {
        id: '2',
        contentId: 'comment-789',
        contentType: 'comment',
        contentTitle: 'Comment on "Electric vs Gas Cars"',
        contentPreview: 'This is completely wrong information...',
        reportReason: 'Inappropriate content',
        reporterId: 'user-789',
        reporterName: 'Jane Smith',
        reportedAt: new Date(Date.now() - 7200000),
        priority: 'high',
        status: 'pending'
      },
      {
        id: '3',
        contentId: 'review-456',
        contentType: 'review',
        contentTitle: 'Review of Toyota Camry 2023',
        contentPreview: 'Terrible car, worst experience ever...',
        reportReason: 'Harassment',
        reporterId: 'user-321',
        reporterName: 'Mike Johnson',
        reportedAt: new Date(Date.now() - 10800000),
        priority: 'urgent',
        status: 'pending'
      }
    ];

    return of({
      items: mockItems,
      totalCount: mockItems.length,
      totalPages: 1
    });
  }

  getAllItems(page: number = 1, pageSize: number = 20, status?: string): Observable<ModerationResponse> {
    return this.http.get<ModerationResponse>(`${this.apiUrl}/items`, {
      params: { page: page.toString(), pageSize: pageSize.toString(), ...(status && { status }) }
    });
  }

  approveItem(itemId: string, notes?: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/items/${itemId}/approve`, { notes });
  }

  rejectItem(itemId: string, reason: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/items/${itemId}/reject`, { reason });
  }

  dismissItem(itemId: string, notes?: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/items/${itemId}/dismiss`, { notes });
  }

  banUser(userId: string, reason: string, durationDays?: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/users/${userId}/ban`, { 
      reason, 
      durationDays 
    });
  }

  getItemDetails(itemId: string): Observable<ModerationItem> {
    return this.http.get<ModerationItem>(`${this.apiUrl}/items/${itemId}`);
  }
}