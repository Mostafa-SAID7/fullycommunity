import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PagedResult } from '../../types/common.types';
import {
  HomeFeedItem,
  PersonalizedFeed,
  FeedRequest,
  UserPreferences,
  UserActivity,
  UpdatePreferencesRequest,
  Recommendation,
  TrendingContent,
  SimilarContent,
  RecommendationFeedbackRequest
} from '../../interfaces/home';

@Injectable({
  providedIn: 'root'
})
export class HomeFeedService {
  private readonly apiUrl = `${environment.apiUrl}/home`;

  constructor(private http: HttpClient) {}

  /**
   * Get personalized home feed
   */
  getPersonalizedFeed(request: FeedRequest): Observable<PagedResult<HomeFeedItem>> {
    let params = new HttpParams();
    
    params = params.set('filterType', request.filterType.toString());
    if (request.contentTypes?.length) params = params.set('contentTypes', request.contentTypes.join(','));
    if (request.categories?.length) params = params.set('categories', request.categories.join(','));
    if (request.tags?.length) params = params.set('tags', request.tags.join(','));
    params = params.set('sortBy', request.sortBy.toString());
    if (request.timeRange !== null && request.timeRange !== undefined) params = params.set('timeRange', request.timeRange.toString());
    if (request.latitude !== null) params = params.set('latitude', request.latitude.toString());
    if (request.longitude !== null) params = params.set('longitude', request.longitude.toString());
    if (request.radiusKm !== null) params = params.set('radiusKm', request.radiusKm.toString());
    params = params.set('page', request.page.toString());
    params = params.set('pageSize', request.pageSize.toString());
    
    return this.http.get<PagedResult<HomeFeedItem>>(`${this.apiUrl}/feed`, { params });
  }

  /**
   * Get complete personalized feed with sections
   */
  getCompleteFeed(): Observable<PersonalizedFeed> {
    return this.http.get<PersonalizedFeed>(`${this.apiUrl}/feed/complete`);
  }

  /**
   * Get trending content
   */
  getTrending(contentType?: number, timeRange?: number): Observable<TrendingContent[]> {
    let params = new HttpParams();
    if (contentType !== undefined) params = params.set('contentType', contentType.toString());
    if (timeRange !== undefined) params = params.set('timeRange', timeRange.toString());
    
    return this.http.get<TrendingContent[]>(`${this.apiUrl}/trending`, { params });
  }

  /**
   * Get recommendations
   */
  getRecommendations(limit: number = 20): Observable<Recommendation[]> {
    return this.http.get<Recommendation[]>(`${this.apiUrl}/recommendations`, {
      params: { limit: limit.toString() }
    });
  }

  /**
   * Get similar content
   */
  getSimilarContent(contentId: string, contentType: number, limit: number = 10): Observable<SimilarContent[]> {
    return this.http.get<SimilarContent[]>(`${this.apiUrl}/similar`, {
      params: {
        contentId,
        contentType: contentType.toString(),
        limit: limit.toString()
      }
    });
  }

  /**
   * Get user preferences
   */
  getPreferences(): Observable<UserPreferences> {
    return this.http.get<UserPreferences>(`${this.apiUrl}/preferences`);
  }

  /**
   * Update user preferences
   */
  updatePreferences(request: UpdatePreferencesRequest): Observable<UserPreferences> {
    return this.http.put<UserPreferences>(`${this.apiUrl}/preferences`, request);
  }

  /**
   * Get user activity
   */
  getUserActivity(): Observable<UserActivity> {
    return this.http.get<UserActivity>(`${this.apiUrl}/activity`);
  }

  /**
   * Track content view
   */
  trackView(contentId: string, contentType: number, duration?: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/track/view`, {
      contentId,
      contentType,
      duration
    });
  }

  /**
   * Track content interaction
   */
  trackInteraction(contentId: string, contentType: number, action: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/track/interaction`, {
      contentId,
      contentType,
      action
    });
  }

  /**
   * Submit recommendation feedback
   */
  submitFeedback(request: RecommendationFeedbackRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/recommendations/feedback`, request);
  }

  /**
   * Refresh feed
   */
  refreshFeed(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/feed/refresh`, {});
  }

  /**
   * Get feed by source
   */
  getFeedBySource(source: number, page: number = 1, pageSize: number = 20): Observable<PagedResult<HomeFeedItem>> {
    return this.http.get<PagedResult<HomeFeedItem>>(`${this.apiUrl}/feed/source/${source}`, {
      params: { page: page.toString(), pageSize: pageSize.toString() }
    });
  }

  /**
   * Get saved items
   */
  getSavedItems(page: number = 1, pageSize: number = 20): Observable<PagedResult<HomeFeedItem>> {
    return this.http.get<PagedResult<HomeFeedItem>>(`${this.apiUrl}/saved`, {
      params: { page: page.toString(), pageSize: pageSize.toString() }
    });
  }

  /**
   * Save item
   */
  saveItem(contentId: string, contentType: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/saved`, { contentId, contentType });
  }

  /**
   * Unsave item
   */
  unsaveItem(contentId: string, contentType: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/saved/${contentId}/${contentType}`);
  }
}
