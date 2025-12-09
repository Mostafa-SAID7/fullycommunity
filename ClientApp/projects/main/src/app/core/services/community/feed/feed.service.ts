import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { PagedResult } from '../../../types';
import {
  FeedItem,
  FeedFilter,
  TrendingContent,
  SuggestedContent,
  HotQuestion,
  TrendingPost,
  LatestNews,
  UpcomingEvent,
  PopularGuide,
  SuggestedGroup,
  SuggestedFriend,
  RelatedReview,
  PopularLocation,
  TopPage,
  MarkViewedRequest,
  FeedbackRequest,
  DismissSuggestionRequest,
  UpdatePreferencesRequest,
  ReportContentRequest,
  SaveForLaterRequest
} from '../../../interfaces/community/feed';

@Injectable({ providedIn: 'root' })
export class FeedService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/community/feed`;

  // ============================================================================
  // PERSONALIZED FEED
  // ============================================================================

  /**
   * Get personalized feed based on user interests and activity
   */
  getPersonalizedFeed(filter: FeedFilter = {}, page = 1, pageSize = 20): Observable<PagedResult<FeedItem>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (filter.sectionType !== undefined) params = params.set('sectionType', filter.sectionType.toString());
    if (filter.contentTypes?.length) params = params.set('contentTypes', filter.contentTypes.join(','));
    if (filter.interests?.length) params = params.set('interests', filter.interests.join(','));
    if (filter.excludeViewed) params = params.set('excludeViewed', 'true');
    if (filter.timeRange) params = params.set('timeRange', filter.timeRange);
    if (filter.searchTerm) params = params.set('searchTerm', filter.searchTerm);
    if (filter.sortBy) params = params.set('sortBy', filter.sortBy);

    return this.http.get<PagedResult<FeedItem>>(`${this.apiUrl}/personalized`, { params });
  }

  /**
   * Get feed from users you follow
   */
  getFollowingFeed(page = 1, pageSize = 20): Observable<PagedResult<FeedItem>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<PagedResult<FeedItem>>(`${this.apiUrl}/following`, { params });
  }

  // ============================================================================
  // TRENDING & POPULAR
  // ============================================================================

  /**
   * Get trending content across all features
   */
  getTrendingContent(count = 10): Observable<TrendingContent[]> {
    return this.http.get<TrendingContent[]>(`${this.apiUrl}/trending`, {
      params: { count: count.toString() }
    });
  }

  /**
   * Get trending posts
   */
  getTrendingPosts(count = 10): Observable<TrendingPost[]> {
    return this.http.get<TrendingPost[]>(`${this.apiUrl}/trending/posts`, {
      params: { count: count.toString() }
    });
  }

  /**
   * Get hot questions from Q&A
   */
  getHotQuestions(count = 10): Observable<HotQuestion[]> {
    return this.http.get<HotQuestion[]>(`${this.apiUrl}/hot/questions`, {
      params: { count: count.toString() }
    });
  }

  /**
   * Get popular guides
   */
  getPopularGuides(count = 10): Observable<PopularGuide[]> {
    return this.http.get<PopularGuide[]>(`${this.apiUrl}/popular/guides`, {
      params: { count: count.toString() }
    });
  }

  /**
   * Get popular map locations
   */
  getPopularLocations(count = 10): Observable<PopularLocation[]> {
    return this.http.get<PopularLocation[]>(`${this.apiUrl}/popular/locations`, {
      params: { count: count.toString() }
    });
  }

  /**
   * Get top pages based on followers and engagement
   */
  getTopPages(count = 10): Observable<TopPage[]> {
    return this.http.get<TopPage[]>(`${this.apiUrl}/top/pages`, {
      params: { count: count.toString() }
    });
  }

  // ============================================================================
  // LATEST CONTENT
  // ============================================================================

  /**
   * Get latest news articles
   */
  getLatestNews(count = 10): Observable<LatestNews[]> {
    return this.http.get<LatestNews[]>(`${this.apiUrl}/latest/news`, {
      params: { count: count.toString() }
    });
  }

  /**
   * Get upcoming events
   */
  getUpcomingEvents(count = 10): Observable<UpcomingEvent[]> {
    return this.http.get<UpcomingEvent[]>(`${this.apiUrl}/upcoming/events`, {
      params: { count: count.toString() }
    });
  }

  // ============================================================================
  // SUGGESTIONS & RECOMMENDATIONS
  // ============================================================================

  /**
   * Get personalized content suggestions
   */
  getSuggestedContent(count = 10): Observable<SuggestedContent[]> {
    return this.http.get<SuggestedContent[]>(`${this.apiUrl}/suggestions/content`, {
      params: { count: count.toString() }
    });
  }

  /**
   * Get suggested groups based on interests
   */
  getSuggestedGroups(count = 10): Observable<SuggestedGroup[]> {
    return this.http.get<SuggestedGroup[]>(`${this.apiUrl}/suggestions/groups`, {
      params: { count: count.toString() }
    });
  }

  /**
   * Get friend suggestions
   */
  getSuggestedFriends(count = 10): Observable<SuggestedFriend[]> {
    return this.http.get<SuggestedFriend[]>(`${this.apiUrl}/suggestions/friends`, {
      params: { count: count.toString() }
    });
  }

  /**
   * Get reviews related to user's car or interests
   */
  getRelatedReviews(count = 10): Observable<RelatedReview[]> {
    return this.http.get<RelatedReview[]>(`${this.apiUrl}/related/reviews`, {
      params: { count: count.toString() }
    });
  }

  // ============================================================================
  // INTERACTIONS
  // ============================================================================

  /**
   * Mark content as viewed (for personalization)
   */
  markAsViewed(request: MarkViewedRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/viewed`, request);
  }

  /**
   * Dismiss suggested content
   */
  dismissSuggestion(suggestionId: string, request?: DismissSuggestionRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/suggestions/${suggestionId}/dismiss`, request || {});
  }

  /**
   * Provide feedback on suggestions
   */
  provideFeedback(suggestionId: string, request: FeedbackRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/suggestions/${suggestionId}/feedback`, request);
  }

  /**
   * Update feed preferences
   */
  updatePreferences(request: UpdatePreferencesRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/preferences`, request);
  }

  /**
   * Report inappropriate content
   */
  reportContent(request: ReportContentRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/report`, request);
  }

  /**
   * Save content for later reading
   */
  saveForLater(request: SaveForLaterRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/save`, request);
  }

  /**
   * Get saved content
   */
  getSavedContent(page = 1, pageSize = 20): Observable<PagedResult<FeedItem>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<PagedResult<FeedItem>>(`${this.apiUrl}/saved`, { params });
  }

  /**
   * Remove saved content
   */
  removeSaved(itemId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/saved/${itemId}`);
  }
}
