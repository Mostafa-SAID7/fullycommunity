import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import {
  AdminCommunityPost,
  AdminCommunityQuestion,
  AdminCommunityReview,
  AdminCommunityEvent,
  AdminCommunityGroup,
  CommunityFilter,
  CommunityStatistics
} from '../../../interfaces/content/community/admin-community.interface';

@Injectable({
  providedIn: 'root'
})
export class AdminCommunityService {
  private readonly apiUrl = `${environment.apiUrl}/admin/community`;

  constructor(private http: HttpClient) {}

  /**
   * Get community posts
   */
  getPosts(filter: CommunityFilter, page: number = 1, pageSize: number = 20): Observable<{ posts: AdminCommunityPost[], total: number }> {
    let params = this.buildFilterParams(filter, page, pageSize);
    return this.http.get<{ posts: AdminCommunityPost[], total: number }>(`${this.apiUrl}/posts`, { params });
  }

  /**
   * Get community questions
   */
  getQuestions(filter: CommunityFilter, page: number = 1, pageSize: number = 20): Observable<{ questions: AdminCommunityQuestion[], total: number }> {
    let params = this.buildFilterParams(filter, page, pageSize);
    return this.http.get<{ questions: AdminCommunityQuestion[], total: number }>(`${this.apiUrl}/questions`, { params });
  }

  /**
   * Get community reviews
   */
  getReviews(filter: CommunityFilter, page: number = 1, pageSize: number = 20): Observable<{ reviews: AdminCommunityReview[], total: number }> {
    let params = this.buildFilterParams(filter, page, pageSize);
    return this.http.get<{ reviews: AdminCommunityReview[], total: number }>(`${this.apiUrl}/reviews`, { params });
  }

  /**
   * Get community events
   */
  getEvents(filter: CommunityFilter, page: number = 1, pageSize: number = 20): Observable<{ events: AdminCommunityEvent[], total: number }> {
    let params = this.buildFilterParams(filter, page, pageSize);
    return this.http.get<{ events: AdminCommunityEvent[], total: number }>(`${this.apiUrl}/events`, { params });
  }

  /**
   * Get community groups
   */
  getGroups(filter: CommunityFilter, page: number = 1, pageSize: number = 20): Observable<{ groups: AdminCommunityGroup[], total: number }> {
    let params = this.buildFilterParams(filter, page, pageSize);
    return this.http.get<{ groups: AdminCommunityGroup[], total: number }>(`${this.apiUrl}/groups`, { params });
  }

  /**
   * Approve content
   */
  approveContent(contentId: string, contentType: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/approve`, { contentId, contentType });
  }

  /**
   * Reject content
   */
  rejectContent(contentId: string, contentType: string, reason: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/reject`, { contentId, contentType, reason });
  }

  /**
   * Flag content
   */
  flagContent(contentId: string, contentType: string, reason: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/flag`, { contentId, contentType, reason });
  }

  /**
   * Hide content
   */
  hideContent(contentId: string, contentType: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/hide`, { contentId, contentType });
  }

  /**
   * Delete content
   */
  deleteContent(contentId: string, contentType: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/content/${contentId}/${contentType}`);
  }

  /**
   * Get community statistics
   */
  getStatistics(): Observable<CommunityStatistics> {
    return this.http.get<CommunityStatistics>(`${this.apiUrl}/statistics`);
  }

  /**
   * Get moderation queue
   */
  getModerationQueue(page: number = 1, pageSize: number = 20): Observable<any> {
    return this.http.get(`${this.apiUrl}/moderation-queue`, {
      params: {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    });
  }

  /**
   * Get reported content
   */
  getReportedContent(page: number = 1, pageSize: number = 20): Observable<any> {
    return this.http.get(`${this.apiUrl}/reported`, {
      params: {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    });
  }

  /**
   * Export community data
   */
  exportData(filter: CommunityFilter, format: string = 'csv'): Observable<Blob> {
    let params = this.buildFilterParams(filter, 1, 10000);
    params = params.set('format', format);
    
    return this.http.get(`${this.apiUrl}/export`, {
      params,
      responseType: 'blob'
    });
  }

  /**
   * Build filter parameters
   */
  private buildFilterParams(filter: CommunityFilter, page: number, pageSize: number): HttpParams {
    let params = new HttpParams();
    params = params.set('page', page.toString());
    params = params.set('pageSize', pageSize.toString());
    
    if (filter.search) params = params.set('search', filter.search);
    if (filter.contentType !== null && filter.contentType !== undefined) params = params.set('contentType', filter.contentType.toString());
    if (filter.status !== null && filter.status !== undefined) params = params.set('status', filter.status.toString());
    if (filter.moderationStatus !== null && filter.moderationStatus !== undefined) params = params.set('moderationStatus', filter.moderationStatus.toString());
    if (filter.authorId) params = params.set('authorId', filter.authorId);
    if (filter.category) params = params.set('category', filter.category);
    if (filter.dateFrom) params = params.set('dateFrom', filter.dateFrom);
    if (filter.dateTo) params = params.set('dateTo', filter.dateTo);
    if (filter.hasReports !== null && filter.hasReports !== undefined) params = params.set('hasReports', filter.hasReports.toString());
    if (filter.isFlagged !== null && filter.isFlagged !== undefined) params = params.set('isFlagged', filter.isFlagged.toString());
    
    return params;
  }
}