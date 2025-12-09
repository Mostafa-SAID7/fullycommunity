import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PagedResult } from '../../types/common.types';
import {
  PodcastShowListItem,
  UpdateSubscriptionRequest,
  ListeningHistory,
  QueueItem,
  PodcastPlaylist,
  CreatePlaylistRequest,
  UpdatePlaylistRequest
} from '../../interfaces/podcasts';

@Injectable({
  providedIn: 'root'
})
export class PodcastLibraryService {
  private readonly apiUrl = `${environment.apiUrl}/podcasts`;

  constructor(private http: HttpClient) {}

  // ========== Subscriptions ==========

  /**
   * Get subscribed podcasts
   */
  getSubscriptions(page: number = 1, pageSize: number = 20): Observable<PagedResult<PodcastShowListItem>> {
    return this.http.get<PagedResult<PodcastShowListItem>>(`${this.apiUrl}/subscriptions`, {
      params: { page: page.toString(), pageSize: pageSize.toString() }
    });
  }

  /**
   * Subscribe to podcast
   */
  subscribe(podcastId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${podcastId}/subscribe`, {});
  }

  /**
   * Unsubscribe from podcast
   */
  unsubscribe(podcastId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${podcastId}/subscribe`);
  }

  /**
   * Update subscription settings
   */
  updateSubscription(podcastId: string, request: UpdateSubscriptionRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${podcastId}/subscription`, request);
  }

  // ========== Listening History ==========

  /**
   * Get listening history
   */
  getHistory(page: number = 1, pageSize: number = 20): Observable<PagedResult<ListeningHistory>> {
    return this.http.get<PagedResult<ListeningHistory>>(`${this.apiUrl}/history`, {
      params: { page: page.toString(), pageSize: pageSize.toString() }
    });
  }

  /**
   * Clear listening history
   */
  clearHistory(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/history`);
  }

  /**
   * Remove episode from history
   */
  removeFromHistory(episodeId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/history/${episodeId}`);
  }

  // ========== Queue ==========

  /**
   * Get queue
   */
  getQueue(): Observable<QueueItem[]> {
    return this.http.get<QueueItem[]>(`${this.apiUrl}/queue`);
  }

  /**
   * Add to queue
   */
  addToQueue(episodeId: string, position?: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/queue`, { episodeId, position });
  }

  /**
   * Remove from queue
   */
  removeFromQueue(episodeId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/queue/${episodeId}`);
  }

  /**
   * Reorder queue
   */
  reorderQueue(episodeId: string, newPosition: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/queue/${episodeId}/position`, { position: newPosition });
  }

  /**
   * Clear queue
   */
  clearQueue(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/queue`);
  }

  // ========== Playlists ==========

  /**
   * Get user playlists
   */
  getPlaylists(page: number = 1, pageSize: number = 20): Observable<PagedResult<PodcastPlaylist>> {
    return this.http.get<PagedResult<PodcastPlaylist>>(`${this.apiUrl}/playlists`, {
      params: { page: page.toString(), pageSize: pageSize.toString() }
    });
  }

  /**
   * Get playlist by ID
   */
  getPlaylistById(playlistId: string): Observable<PodcastPlaylist> {
    return this.http.get<PodcastPlaylist>(`${this.apiUrl}/playlists/${playlistId}`);
  }

  /**
   * Create playlist
   */
  createPlaylist(request: CreatePlaylistRequest): Observable<PodcastPlaylist> {
    return this.http.post<PodcastPlaylist>(`${this.apiUrl}/playlists`, request);
  }

  /**
   * Update playlist
   */
  updatePlaylist(playlistId: string, request: UpdatePlaylistRequest): Observable<PodcastPlaylist> {
    return this.http.put<PodcastPlaylist>(`${this.apiUrl}/playlists/${playlistId}`, request);
  }

  /**
   * Delete playlist
   */
  deletePlaylist(playlistId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/playlists/${playlistId}`);
  }

  /**
   * Add episode to playlist
   */
  addToPlaylist(playlistId: string, episodeId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/playlists/${playlistId}/episodes`, { episodeId });
  }

  /**
   * Remove episode from playlist
   */
  removeFromPlaylist(playlistId: string, episodeId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/playlists/${playlistId}/episodes/${episodeId}`);
  }

  /**
   * Reorder playlist
   */
  reorderPlaylist(playlistId: string, episodeId: string, newPosition: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/playlists/${playlistId}/episodes/${episodeId}/position`, { position: newPosition });
  }

  // ========== Favorites ==========

  /**
   * Get favorite episodes
   */
  getFavorites(page: number = 1, pageSize: number = 20): Observable<PagedResult<any>> {
    return this.http.get<PagedResult<any>>(`${this.apiUrl}/favorites`, {
      params: { page: page.toString(), pageSize: pageSize.toString() }
    });
  }

  /**
   * Add to favorites
   */
  addToFavorites(episodeId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/episodes/${episodeId}/favorite`, {});
  }

  /**
   * Remove from favorites
   */
  removeFromFavorites(episodeId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/episodes/${episodeId}/favorite`);
  }
}
