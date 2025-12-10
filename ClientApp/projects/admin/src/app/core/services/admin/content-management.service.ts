import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  AdminContent,
  ContentFilter,
  ContentAction,
  BulkContentAction,
  ContentStatistics
} from '../../interfaces/admin/content-management.interface';

@Injectable({
  providedIn: 'root'
})
export class ContentManagementService {
  private readonly apiUrl = `${environment.apiUrl}/admin/content`;

  constructor(private http: HttpClient) {}

  /**
   * Get content with filtering and pagination
   */
  getContent(filter: ContentFilter, page: number = 1, pageSize: number = 20): Observable<{ content: AdminContent[], total: number }> {
    let params = new HttpParams();
    params = params.set('page', page.toString());
    params = params.set('pageSize', pageSize.toString());
    
    if (filter.search) params = params.set('search', filter.search);
    if (filter.type !== null && filter.type !== undefined) params = params.set('type', filter.type.toString());
    if (filter.status !== null && filter.status !== undefined) params = params.set('status', filter.status.toString());
    if (filter.moderationStatus !== null && filter.moderationStatus !== undefined) params = params.set('moderationStatus', filter.moderationStatus.toString());
    if (filter.authorId) params = params.set('authorId', filter.authorId);
    if (filter.dateFrom) params = params.set('dateFrom', filter.dateFrom);
    if (filter.dateTo) params = params.set('dateTo', filter.dateTo);
    if (filter.hasReports !== null && filter.hasReports !== undefined) params = params.set('hasReports', filter.hasReports.toString());
    if (filter.isFlagged !== null && filter.isFlagged !== undefined) params = params.set('isFlagged', filter.isFlagged.toString());
    
    return this.http.get<{ content: AdminContent[], total: number }>(this.apiUrl, { params });
  }

  /**
   * Get content by ID
   */
  getContentById(contentId: string): Observable<AdminContent> {
    return this.http.get<AdminContent>(`${this.apiUrl}/${contentId}`);
  }

  /**
   * Perform content action
   */
  performContentAction(action: ContentAction): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/action`, action);
  }

  /**
   * Perform bulk content action
   */
  performBulkAction(action: BulkContentAction): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/bulk-action`, action);
  }

  /**
   * Get content statistics
   */
  getContentStatistics(): Observable<ContentStatistics> {
    return this.http.get<ContentStatistics>(`${this.apiUrl}/statistics`);
  }

  /**
   * Get pending moderation queue
   */
  getModerationQueue(page: number = 1, pageSize: number = 20): Observable<{ content: AdminContent[], total: number }> {
    return this.http.get<{ content: AdminContent[], total: number }>(`${this.apiUrl}/moderation-queue`, {
      params: {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    });
  }

  /**
   * Get reported content
   */
  getReportedContent(page: number = 1, pageSize: number = 20): Observable<{ content: AdminContent[], total: number }> {
    return this.http.get<{ content: AdminContent[], total: number }>(`${this.apiUrl}/reported`, {
      params: {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    });
  }

  /**
   * Get flagged content
   */
  getFlaggedContent(page: number = 1, pageSize: number = 20): Observable<{ content: AdminContent[], total: number }> {
    return this.http.get<{ content: AdminContent[], total: number }>(`${this.apiUrl}/flagged`, {
      params: {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    });
  }

  /**
   * Export content
   */
  exportContent(filter: ContentFilter, format: string = 'csv'): Observable<Blob> {
    let params = new HttpParams();
    params = params.set('format', format);
    
    if (filter.search) params = params.set('search', filter.search);
    if (filter.type !== null && filter.type !== undefined) params = params.set('type', filter.type.toString());
    if (filter.status !== null && filter.status !== undefined) params = params.set('status', filter.status.toString());
    if (filter.moderationStatus !== null && filter.moderationStatus !== undefined) params = params.set('moderationStatus', filter.moderationStatus.toString());
    if (filter.authorId) params = params.set('authorId', filter.authorId);
    if (filter.dateFrom) params = params.set('dateFrom', filter.dateFrom);
    if (filter.dateTo) params = params.set('dateTo', filter.dateTo);
    
    return this.http.get(`${this.apiUrl}/export`, {
      params,
      responseType: 'blob'
    });
  }

  /**
   * Get content reports
   */
  getContentReports(contentId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${contentId}/reports`);
  }

  /**
   * Get content analytics
   */
  getContentAnalytics(contentId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${contentId}/analytics`);
  }

  /**
   * Feature content
   */
  featureContent(contentId: string, featured: boolean): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${contentId}/feature`, { featured });
  }

  /**
   * Pin content
   */
  pinContent(contentId: string, pinned: boolean): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${contentId}/pin`, { pinned });
  }
}