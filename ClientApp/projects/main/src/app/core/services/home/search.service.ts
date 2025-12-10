import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PagedResult } from '../../types/common.types';
import {
  SearchRequest,
  SearchResult,
  SearchSuggestions,
  SearchHistory,
  PopularSearches
} from '../../interfaces/home/search.interface';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private readonly apiUrl = `${environment.apiUrl}/search`;

  constructor(private http: HttpClient) {}

  /**
   * Search content
   */
  search(request: SearchRequest): Observable<PagedResult<SearchResult>> {
    return this.http.post<PagedResult<SearchResult>>(`${this.apiUrl}`, request);
  }

  /**
   * Get search suggestions
   */
  getSuggestions(query: string, limit: number = 10): Observable<SearchSuggestions> {
    return this.http.get<SearchSuggestions>(`${this.apiUrl}/suggestions`, {
      params: { query, limit: limit.toString() }
    });
  }

  /**
   * Get search history
   */
  getHistory(limit: number = 20): Observable<SearchHistory[]> {
    return this.http.get<SearchHistory[]>(`${this.apiUrl}/history`, {
      params: { limit: limit.toString() }
    });
  }

  /**
   * Clear search history
   */
  clearHistory(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/history`);
  }

  /**
   * Delete history item
   */
  deleteHistoryItem(historyId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/history/${historyId}`);
  }

  /**
   * Get popular searches
   */
  getPopularSearches(timeRange?: string): Observable<PopularSearches> {
    let params = new HttpParams();
    if (timeRange) params = params.set('timeRange', timeRange);
    
    return this.http.get<PopularSearches>(`${this.apiUrl}/popular`, { params });
  }

  /**
   * Track search
   */
  trackSearch(query: string, resultCount: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/track`, { query, resultCount });
  }
}
