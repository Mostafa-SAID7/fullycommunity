import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Podcast {
  id: string;
  channelId: string;
  channelName: string;
  channelAvatarUrl: string;
  title: string;
  description?: string;
  slug?: string;
  coverImageUrl?: string;
  category: string;
  episodeCount: number;
  subscriberCount: number;
  averageRating: number;
  publishedAt?: string;
}

export interface Episode {
  id: string;
  podcastId: string;
  podcastTitle: string;
  podcastCoverImageUrl?: string;
  title: string;
  description?: string;
  slug?: string;
  seasonNumber?: number;
  episodeNumber: number;
  thumbnailUrl?: string;
  audioUrl: string;
  duration: string;
  type: string;
  publishedAt?: string;
  playCount: number;
  likeCount: number;
  commentCount: number;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

@Injectable({ providedIn: 'root' })
export class PodcastService {
  private readonly apiUrl = `${environment.apiUrl}/api/podcasts`;
  
  subscriptions = signal<Podcast[]>([]);
  queue = signal<Episode[]>([]);

  constructor(private http: HttpClient) {}

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

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/categories`);
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

  isSubscribed(podcastId: string): Observable<{ isSubscribed: boolean }> {
    return this.http.get<{ isSubscribed: boolean }>(`${this.apiUrl}/${podcastId}/subscription`);
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

  getHistory(page = 1, pageSize = 20): Observable<PagedResult<any>> {
    return this.http.get<PagedResult<any>>(`${this.apiUrl}/library/history`, { params: { page, pageSize } });
  }

  getQueue(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/library/queue`);
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
    return this.http.post<void>(`${this.apiUrl}/${podcastId}/episodes/${episodeId}/progress`, {
      currentPosition: `00:${Math.floor(position / 60)}:${position % 60}`,
      listenDuration: `00:${Math.floor(position / 60)}:${position % 60}`,
      listenPercent: percent,
      isCompleted: percent >= 95
    });
  }
}
