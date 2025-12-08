import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import {
  Podcast,
  Episode,
  PagedResult,
  PodcastCategory,
  SubscriptionStatus,
  ProgressUpdate,
  HistoryItem,
  PodcastShow,
  PodcastShowsResponse
} from '../../../interfaces/content/podcasts/podcast.interface';

@Injectable({ providedIn: 'root' })
export class PodcastService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/podcasts`;
  private readonly adminApiUrl = `${environment.apiUrl}/admin/dashboard/podcasts`;
  
  subscriptions = signal<Podcast[]>([]);
  queue = signal<Episode[]>([]);

  // Podcasts
  searchPodcasts(query?: string, category?: string, page = 1, pageSize = 20): Observable<PagedResult<Podcast>> {
    const params: any = { page, pageSize };
    if (query) params.query = query;
    if (category) params.category = category;
    return this.http.get<PagedResult<Podcast>>(this.apiUrl, { params });
  }

  getTrendingPodcasts(count = 20): Observable<Podcast[]> {
    return this.http.get<Podcast[]>(`${this.apiUrl}/trending`, { params: { count } });
  }

  getRecommendedPodcasts(count = 20): Observable<Podcast[]> {
    return this.http.get<Podcast[]>(`${this.apiUrl}/recommended`, { params: { count } });
  }

  getPodcast(id: string): Observable<Podcast> {
    return this.http.get<Podcast>(`${this.apiUrl}/${id}`);
  }

  getPodcastBySlug(slug: string): Observable<Podcast> {
    return this.http.get<Podcast>(`${this.apiUrl}/slug/${slug}`);
  }

  getCategories(): Observable<PodcastCategory[]> {
    return this.http.get<PodcastCategory[]>(`${this.apiUrl}/categories`);
  }

  // Episodes
  getEpisodes(podcastId: string, page = 1, pageSize = 20): Observable<PagedResult<Episode>> {
    return this.http.get<PagedResult<Episode>>(`${this.apiUrl}/${podcastId}/episodes`, { params: { page, pageSize } });
  }

  getEpisode(podcastId: string, episodeId: string): Observable<Episode> {
    return this.http.get<Episode>(`${this.apiUrl}/${podcastId}/episodes/${episodeId}`);
  }

  getLatestEpisodes(page = 1, pageSize = 20): Observable<PagedResult<Episode>> {
    return this.http.get<PagedResult<Episode>>(`${this.apiUrl}/episodes/latest`, { params: { page, pageSize } });
  }

  getTrendingEpisodes(count = 20): Observable<Episode[]> {
    return this.http.get<Episode[]>(`${this.apiUrl}/episodes/trending`, { params: { count } });
  }

  // Subscriptions
  getSubscriptions(page = 1, pageSize = 20): Observable<PagedResult<Podcast>> {
    return this.http.get<PagedResult<Podcast>>(`${this.apiUrl}/subscriptions`, { params: { page, pageSize } });
  }

  subscribe(podcastId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${podcastId}/subscribe`, {});
  }

  unsubscribe(podcastId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${podcastId}/subscribe`);
  }

  isSubscribed(podcastId: string): Observable<SubscriptionStatus> {
    return this.http.get<SubscriptionStatus>(`${this.apiUrl}/${podcastId}/subscription`);
  }

  // Engagement
  reactToEpisode(episodeId: string, reactionType: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/episodes/${episodeId}/reactions/${reactionType}`, {});
  }

  removeReaction(episodeId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/episodes/${episodeId}/reactions`);
  }

  // Library
  getSavedEpisodes(page = 1, pageSize = 20): Observable<PagedResult<Episode>> {
    return this.http.get<PagedResult<Episode>>(`${this.apiUrl}/library/saved`, { params: { page, pageSize } });
  }

  saveEpisode(episodeId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/library/saved/${episodeId}`, {});
  }

  unsaveEpisode(episodeId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/library/saved/${episodeId}`);
  }

  getHistory(page = 1, pageSize = 20): Observable<PagedResult<HistoryItem>> {
    return this.http.get<PagedResult<HistoryItem>>(`${this.apiUrl}/library/history`, { params: { page, pageSize } });
  }

  getQueue(): Observable<Episode[]> {
    return this.http.get<Episode[]>(`${this.apiUrl}/library/queue`);
  }

  addToQueue(episodeId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/library/queue/${episodeId}`, {});
  }

  removeFromQueue(episodeId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/library/queue/${episodeId}`);
  }

  // Playback
  recordPlay(episodeId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/episodes/${episodeId}/play`, {});
  }

  updateProgress(podcastId: string, episodeId: string, position: number, percent: number): Observable<void> {
    const progressData: ProgressUpdate = {
      currentPosition: `00:${Math.floor(position / 60)}:${position % 60}`,
      listenDuration: `00:${Math.floor(position / 60)}:${position % 60}`,
      listenPercent: percent,
      isCompleted: percent >= 95
    };
    return this.http.post<void>(`${this.apiUrl}/${podcastId}/episodes/${episodeId}/progress`, progressData);
  }

  // Admin Methods
  getShows(page = 1, pageSize = 12, status?: string, search?: string): Observable<PodcastShowsResponse> {
    const params: any = { page, pageSize };
    if (status) params.status = status;
    if (search) params.search = search;
    return this.http.get<PodcastShowsResponse>(`${this.adminApiUrl}/shows`, { params });
  }

  getShow(id: string): Observable<PodcastShow> {
    return this.http.get<PodcastShow>(`${this.adminApiUrl}/shows/${id}`);
  }

  deleteShow(id: string): Observable<void> {
    return this.http.delete<void>(`${this.adminApiUrl}/shows/${id}`);
  }
}
