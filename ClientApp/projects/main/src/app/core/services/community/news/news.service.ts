import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { PagedResult } from '../../../types';
import {
  NewsArticle,
  NewsList,
  NewsCategory,
  NewsFilter,
  CreateNewsRequest,
  UpdateNewsRequest
} from '../../../interfaces/community/news';

@Injectable({ providedIn: 'root' })
export class NewsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/community/news`;

  // ============================================================================
  // NEWS OPERATIONS
  // ============================================================================

  getNews(filter: NewsFilter = {}, page = 1, pageSize = 20): Observable<PagedResult<NewsList>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (filter.status !== undefined) params = params.set('status', filter.status.toString());
    if (filter.categoryId) params = params.set('categoryId', filter.categoryId);
    if (filter.searchTerm) params = params.set('searchTerm', filter.searchTerm);
    if (filter.tag) params = params.set('tag', filter.tag);
    if (filter.isFeatured !== undefined) params = params.set('isFeatured', filter.isFeatured.toString());
    if (filter.isBreaking !== undefined) params = params.set('isBreaking', filter.isBreaking.toString());
    if (filter.sortBy) params = params.set('sortBy', filter.sortBy);

    return this.http.get<PagedResult<NewsList>>(this.apiUrl, { params });
  }

  getArticle(id: string): Observable<NewsArticle> {
    return this.http.get<NewsArticle>(`${this.apiUrl}/${id}`);
  }

  getArticleBySlug(slug: string): Observable<NewsArticle> {
    return this.http.get<NewsArticle>(`${this.apiUrl}/slug/${slug}`);
  }

  getFeaturedNews(count = 5): Observable<NewsList[]> {
    return this.http.get<NewsList[]>(`${this.apiUrl}/featured`, {
      params: { count: count.toString() }
    });
  }

  getBreakingNews(count = 3): Observable<NewsList[]> {
    return this.http.get<NewsList[]>(`${this.apiUrl}/breaking`, {
      params: { count: count.toString() }
    });
  }

  getRelatedNews(articleId: string, count = 5): Observable<NewsList[]> {
    return this.http.get<NewsList[]>(`${this.apiUrl}/${articleId}/related`, {
      params: { count: count.toString() }
    });
  }

  createArticle(request: CreateNewsRequest): Observable<NewsArticle> {
    return this.http.post<NewsArticle>(this.apiUrl, request);
  }

  updateArticle(id: string, request: UpdateNewsRequest): Observable<NewsArticle> {
    return this.http.put<NewsArticle>(`${this.apiUrl}/${id}`, request);
  }

  deleteArticle(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  publishArticle(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/publish`, {});
  }

  // ============================================================================
  // INTERACTION OPERATIONS
  // ============================================================================

  likeArticle(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/like`, {});
  }

  unlikeArticle(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/like`);
  }

  shareArticle(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/share`, {});
  }

  // ============================================================================
  // CATEGORY OPERATIONS
  // ============================================================================

  getCategories(): Observable<NewsCategory[]> {
    return this.http.get<NewsCategory[]>(`${this.apiUrl}/categories`);
  }
}
