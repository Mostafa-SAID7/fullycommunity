import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PagedResult } from '../../types/common.types';
import {
  EpisodeComment,
  CreateCommentRequest,
  PodcastRating,
  PodcastRatingSummary,
  CreateRatingRequest,
  UpdateRatingRequest,
  EpisodeReactionSummary,
  PodcastReactionType,
  EpisodeShare,
  CreateShareRequest
} from '../../interfaces/podcasts';

@Injectable({
  providedIn: 'root'
})
export class PodcastEngagementService {
  private readonly apiUrl = `${environment.apiUrl}/podcasts`;

  constructor(private http: HttpClient) {}

  // ========== Comments ==========

  /**
   * Get episode comments
   */
  getComments(episodeId: string, page: number = 1, pageSize: number = 20): Observable<PagedResult<EpisodeComment>> {
    return this.http.get<PagedResult<EpisodeComment>>(`${this.apiUrl}/episodes/${episodeId}/comments`, {
      params: { page: page.toString(), pageSize: pageSize.toString() }
    });
  }

  /**
   * Create comment
   */
  createComment(episodeId: string, request: CreateCommentRequest): Observable<EpisodeComment> {
    return this.http.post<EpisodeComment>(`${this.apiUrl}/episodes/${episodeId}/comments`, request);
  }

  /**
   * Update comment
   */
  updateComment(episodeId: string, commentId: string, content: string): Observable<EpisodeComment> {
    return this.http.put<EpisodeComment>(`${this.apiUrl}/episodes/${episodeId}/comments/${commentId}`, { content });
  }

  /**
   * Delete comment
   */
  deleteComment(episodeId: string, commentId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/episodes/${episodeId}/comments/${commentId}`);
  }

  /**
   * Like comment
   */
  likeComment(episodeId: string, commentId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/episodes/${episodeId}/comments/${commentId}/like`, {});
  }

  /**
   * Unlike comment
   */
  unlikeComment(episodeId: string, commentId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/episodes/${episodeId}/comments/${commentId}/like`);
  }

  /**
   * Pin comment
   */
  pinComment(episodeId: string, commentId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/episodes/${episodeId}/comments/${commentId}/pin`, {});
  }

  /**
   * Unpin comment
   */
  unpinComment(episodeId: string, commentId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/episodes/${episodeId}/comments/${commentId}/pin`);
  }

  // ========== Reactions ==========

  /**
   * Get reaction summary
   */
  getReactionSummary(episodeId: string): Observable<EpisodeReactionSummary> {
    return this.http.get<EpisodeReactionSummary>(`${this.apiUrl}/episodes/${episodeId}/reactions`);
  }

  /**
   * Add reaction
   */
  addReaction(episodeId: string, reactionType: PodcastReactionType): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/episodes/${episodeId}/reactions`, { reactionType });
  }

  /**
   * Remove reaction
   */
  removeReaction(episodeId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/episodes/${episodeId}/reactions`);
  }

  // ========== Ratings ==========

  /**
   * Get rating summary
   */
  getRatingSummary(podcastId: string): Observable<PodcastRatingSummary> {
    return this.http.get<PodcastRatingSummary>(`${this.apiUrl}/${podcastId}/ratings/summary`);
  }

  /**
   * Get ratings
   */
  getRatings(podcastId: string, page: number = 1, pageSize: number = 20): Observable<PagedResult<PodcastRating>> {
    return this.http.get<PagedResult<PodcastRating>>(`${this.apiUrl}/${podcastId}/ratings`, {
      params: { page: page.toString(), pageSize: pageSize.toString() }
    });
  }

  /**
   * Create rating
   */
  createRating(podcastId: string, request: CreateRatingRequest): Observable<PodcastRating> {
    return this.http.post<PodcastRating>(`${this.apiUrl}/${podcastId}/ratings`, request);
  }

  /**
   * Update rating
   */
  updateRating(podcastId: string, ratingId: string, request: UpdateRatingRequest): Observable<PodcastRating> {
    return this.http.put<PodcastRating>(`${this.apiUrl}/${podcastId}/ratings/${ratingId}`, request);
  }

  /**
   * Delete rating
   */
  deleteRating(podcastId: string, ratingId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${podcastId}/ratings/${ratingId}`);
  }

  /**
   * Mark rating as helpful
   */
  markRatingHelpful(podcastId: string, ratingId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${podcastId}/ratings/${ratingId}/helpful`, {});
  }

  /**
   * Unmark rating as helpful
   */
  unmarkRatingHelpful(podcastId: string, ratingId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${podcastId}/ratings/${ratingId}/helpful`);
  }

  // ========== Shares ==========

  /**
   * Share episode
   */
  shareEpisode(episodeId: string, request: CreateShareRequest): Observable<EpisodeShare> {
    return this.http.post<EpisodeShare>(`${this.apiUrl}/episodes/${episodeId}/share`, request);
  }

  /**
   * Get share history
   */
  getShareHistory(episodeId: string): Observable<EpisodeShare[]> {
    return this.http.get<EpisodeShare[]>(`${this.apiUrl}/episodes/${episodeId}/shares`);
  }
}
