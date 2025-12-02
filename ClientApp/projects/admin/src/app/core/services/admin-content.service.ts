import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ContentItem {
  id: string;
  title: string;
  type: 'post' | 'review' | 'guide' | 'question' | 'podcast';
  status: 'published' | 'draft' | 'pending' | 'rejected';
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
}

export interface ContentListResponse {
  items: ContentItem[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface ContentStats {
  totalPosts: number;
  totalReviews: number;
  totalGuides: number;
  totalQuestions: number;
  totalPodcasts: number;
  pendingApproval: number;
}

@Injectable({ providedIn: 'root' })
export class AdminContentService {
  private apiUrl = `${environment.apiUrl}/api/admin/dashboard`;

  constructor(private http: HttpClient) {}

  getContentStats(): Observable<ContentStats> {
    return this.http.get<ContentStats>(`${this.apiUrl}/community/content/stats`);
  }

  getPosts(page = 1, pageSize = 10, status?: string): Observable<ContentListResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    if (status) params = params.set('status', status);
    return this.http.get<ContentListResponse>(`${this.apiUrl}/community/posts`, { params });
  }

  getReviews(page = 1, pageSize = 10): Observable<ContentListResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<ContentListResponse>(`${this.apiUrl}/community/reviews`, { params });
  }

  getGuides(page = 1, pageSize = 10): Observable<ContentListResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<ContentListResponse>(`${this.apiUrl}/community/guides`, { params });
  }

  approveContent(type: string, id: string): Observable<void> {
    const endpoint = this.getEndpointForType(type);
    return this.http.post<void>(`${this.apiUrl}/community/${endpoint}/${id}/approve`, {});
  }

  rejectContent(type: string, id: string, reason: string): Observable<void> {
    const endpoint = this.getEndpointForType(type);
    return this.http.post<void>(`${this.apiUrl}/community/${endpoint}/${id}/reject`, { reason });
  }

  deleteContent(type: string, id: string): Observable<void> {
    const endpoint = this.getEndpointForType(type);
    return this.http.delete<void>(`${this.apiUrl}/community/${endpoint}/${id}`);
  }

  featureContent(type: string, id: string): Observable<void> {
    const endpoint = this.getEndpointForType(type);
    return this.http.post<void>(`${this.apiUrl}/community/${endpoint}/${id}/feature`, {});
  }

  private getEndpointForType(type: string): string {
    const typeMap: Record<string, string> = {
      'post': 'posts',
      'review': 'reviews',
      'guide': 'guides',
      'question': 'questions',
      'podcast': 'podcasts'
    };
    return typeMap[type] || `${type}s`;
  }
}
