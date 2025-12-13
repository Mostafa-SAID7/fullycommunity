import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PagedResult } from '../../types/common.types';

// Enums matching backend
export enum PodcastType { Audio = 0, Video = 1, Mixed = 2 }
export enum PodcastStatus { Draft = 0, Published = 1, Archived = 2, Suspended = 3 }
export enum PodcastVisibility { Public = 0, Private = 1, Unlisted = 2 }
export enum PodcastCategory {
  Automotive = 0, Classic = 1, Electric = 2, Racing = 3,
  Maintenance = 4, Business = 5, News = 6, Reviews = 7, DIY = 8, Lifestyle = 9
}
export enum ExplicitContent { None = 0, Clean = 1, Explicit = 2 }
export enum EpisodeType { Full = 0, Trailer = 1, Bonus = 2, Interview = 3 }
export enum EpisodeStatus { Draft = 0, Processing = 1, Published = 2, Scheduled = 3, Archived = 4 }

// DTOs matching backend
export interface PodcastShow {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerAvatarUrl?: string;
  title: string;
  description?: string;
  slug?: string;
  summary?: string;
  coverImageUrl?: string;
  bannerImageUrl?: string;
  type: PodcastType;
  status: PodcastStatus;
  visibility: PodcastVisibility;
  explicitContent: ExplicitContent;
  category: PodcastCategory;
  tags: string[];
  language?: string;
  publishedAt?: string;
  episodeCount: number;
  subscriberCount: number;
  totalPlays: number;
  averageRating: number;
  ratingCount: number;
  allowComments: boolean;
  allowDownloads: boolean;
  applePodcastsUrl?: string;
  spotifyUrl?: string;
  websiteUrl?: string;
  copyright?: string;
  author?: string;
  hosts: PodcastHost[];
  createdAt: string;
}

export interface PodcastListItem {
  id: string;
  title: string;
  description?: string;
  slug?: string;
  coverImageUrl?: string;
  ownerName: string;
  ownerAvatarUrl?: string;
  category: PodcastCategory;
  episodeCount: number;
  subscriberCount: number;
  averageRating: number;
  explicitContent: ExplicitContent;
  publishedAt?: string;
}

export interface PodcastHost {
  id: string;
  userId?: string;
  name: string;
  bio?: string;
  avatarUrl?: string;
  websiteUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  isPrimaryHost: boolean;
}

export interface PodcastCategoryDto {
  name: string;
  description?: string;
  iconUrl?: string;
  podcastCount: number;
}

export interface Episode {
  id: string;
  podcastShowId: string;
  podcastTitle: string;
  podcastCoverImageUrl?: string;
  title: string;
  description?: string;
  slug?: string;
  summary?: string;
  showNotes?: string;
  seasonNumber?: number;
  episodeNumber: number;
  audioUrl: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  duration: string;
  type: EpisodeType;
  status: EpisodeStatus;
  explicitContent: ExplicitContent;
  publishedAt?: string;
  playCount: number;
  downloadCount: number;
  likeCount: number;
  commentCount: number;
  allowComments: boolean;
  allowDownloads: boolean;
  transcriptUrl?: string;
  chapters: EpisodeChapter[];
  guests?: EpisodeGuest[];
  createdAt: string;
}

export interface EpisodeListItem {
  id: string;
  podcastShowId: string;
  podcastTitle: string;
  podcastCoverImageUrl?: string;
  title: string;
  description?: string;
  slug?: string;
  seasonNumber?: number;
  episodeNumber: number;
  thumbnailUrl?: string;
  duration: string;
  type: EpisodeType;
  explicitContent: ExplicitContent;
  publishedAt?: string;
  playCount: number;
  likeCount: number;
  commentCount: number;
}

export interface EpisodeChapter {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  url?: string;
  startTime: string;
  endTime?: string;
}

export interface EpisodeGuest {
  name: string;
  bio?: string;
  avatarUrl?: string;
  websiteUrl?: string;
  twitterUrl?: string;
}

export interface EpisodeComment {
  id: string;
  userId: string;
  userName: string;
  userAvatarUrl?: string;
  content: string;
  timestamp?: string;
  likeCount: number;
  replyCount: number;
  createdAt: string;
  replies?: EpisodeComment[];
}

export interface RatingSummary {
  averageRating: number;
  totalRatings: number;
  distribution: { [key: number]: number };
}

export interface ReactionSummary {
  likes: number;
  dislikes: number;
  userReaction?: string;
}

export interface ListenHistory {
  episodeId: string;
  episode: EpisodeListItem;
  currentPosition: string;
  listenPercent: number;
  isCompleted: boolean;
  lastListenedAt: string;
}

export interface QueueItem {
  episodeId: string;
  episode: EpisodeListItem;
  position: number;
  addedAt: string;
}



// Request DTOs
export interface CreatePodcastRequest {
  title: string;
  description?: string;
  summary?: string;
  coverImageUrl?: string;
  type: PodcastType;
  category: PodcastCategory;
  tags?: string[];
  language?: string;
  explicitContent: ExplicitContent;
  allowComments: boolean;
  allowDownloads: boolean;
}

export interface UpdatePodcastRequest {
  title?: string;
  description?: string;
  summary?: string;
  coverImageUrl?: string;
  bannerImageUrl?: string;
  category?: PodcastCategory;
  tags?: string[];
  language?: string;
  explicitContent?: ExplicitContent;
  allowComments?: boolean;
  allowDownloads?: boolean;
  applePodcastsUrl?: string;
  spotifyUrl?: string;
  websiteUrl?: string;
  copyright?: string;
  author?: string;
}

export interface CreateEpisodeRequest {
  title: string;
  description?: string;
  summary?: string;
  showNotes?: string;
  seasonNumber?: number;
  episodeNumber: number;
  type: EpisodeType;
  explicitContent: ExplicitContent;
  allowComments: boolean;
  allowDownloads: boolean;
  scheduledPublishAt?: string;
  chapters?: CreateChapterRequest[];
  guests?: EpisodeGuest[];
}

export interface CreateChapterRequest {
  title: string;
  description?: string;
  imageUrl?: string;
  url?: string;
  startTime: string;
  endTime?: string;
}

// Legacy interface for backward compatibility
export interface Podcast extends PodcastListItem {
  channelId?: string;
  channelName?: string;
  channelAvatarUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class PodcastService {
  private readonly apiUrl = `${environment.apiUrl}/api/podcasts`;

  subscriptions = signal<PodcastListItem[]>([]);
  queue = signal<QueueItem[]>([]);
  currentEpisode = signal<Episode | null>(null);

  constructor(private http: HttpClient) { }

  // ============ PODCAST SHOWS ============

  searchPodcasts(query?: string, category?: string, page = 1, pageSize = 20, sortBy?: string): Observable<PagedResult<PodcastListItem>> {
    let params = new HttpParams().set('page', page).set('pageSize', pageSize);
    if (query) params = params.set('query', query);
    if (category) params = params.set('category', category);
    if (sortBy) params = params.set('sortBy', sortBy);
    return this.http.get<PagedResult<PodcastListItem>>(this.apiUrl, { params }).pipe(
      catchError(() => of({ items: [], totalCount: 0, page: 1, pageSize: 20, totalPages: 0, hasNextPage: false, hasPreviousPage: false }))
    );
  }

  getTrendingPodcasts(count = 20): Observable<PodcastListItem[]> {
    return this.http.get<PodcastListItem[]>(`${this.apiUrl}/trending`, { params: { count } }).pipe(
      catchError(() => of([]))
    );
  }

  getRecommendedPodcasts(count = 20): Observable<PodcastListItem[]> {
    return this.http.get<PodcastListItem[]>(`${this.apiUrl}/recommended`, { params: { count } }).pipe(
      catchError(() => of([]))
    );
  }

  getPodcast(id: string): Observable<PodcastShow> {
    return this.http.get<PodcastShow>(`${this.apiUrl}/${id}`);
  }

  getPodcastBySlug(slug: string): Observable<PodcastShow> {
    return this.http.get<PodcastShow>(`${this.apiUrl}/slug/${slug}`);
  }

  getCategories(): Observable<PodcastCategoryDto[]> {
    return this.http.get<PodcastCategoryDto[]>(`${this.apiUrl}/categories`).pipe(
      catchError(() => of([]))
    );
  }

  createPodcast(request: CreatePodcastRequest): Observable<PodcastShow> {
    return this.http.post<PodcastShow>(this.apiUrl, request);
  }

  updatePodcast(id: string, request: UpdatePodcastRequest): Observable<PodcastShow> {
    return this.http.put<PodcastShow>(`${this.apiUrl}/${id}`, request);
  }

  publishPodcast(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/publish`, {});
  }

  unpublishPodcast(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/unpublish`, {});
  }

  deletePodcast(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Hosts
  getHosts(podcastId: string): Observable<PodcastHost[]> {
    return this.http.get<PodcastHost[]>(`${this.apiUrl}/${podcastId}/hosts`);
  }

  addHost(podcastId: string, host: Partial<PodcastHost>): Observable<PodcastHost> {
    return this.http.post<PodcastHost>(`${this.apiUrl}/${podcastId}/hosts`, host);
  }

  updateHost(hostId: string, host: Partial<PodcastHost>): Observable<PodcastHost> {
    return this.http.put<PodcastHost>(`${this.apiUrl}/hosts/${hostId}`, host);
  }

  removeHost(hostId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/hosts/${hostId}`);
  }

  // ============ EPISODES ============

  getEpisodes(podcastId: string, page = 1, pageSize = 20, sortBy?: string): Observable<PagedResult<EpisodeListItem>> {
    let params = new HttpParams().set('page', page).set('pageSize', pageSize);
    if (sortBy) params = params.set('sortBy', sortBy);
    return this.http.get<PagedResult<EpisodeListItem>>(`${this.apiUrl}/${podcastId}/episodes`, { params }).pipe(
      catchError(() => of({ items: [], totalCount: 0, page: 1, pageSize: 20, totalPages: 0, hasNextPage: false, hasPreviousPage: false }))
    );
  }

  getEpisode(podcastId: string, episodeId: string): Observable<Episode> {
    return this.http.get<Episode>(`${this.apiUrl}/${podcastId}/episodes/${episodeId}`);
  }

  getLatestEpisodes(page = 1, pageSize = 20): Observable<PagedResult<EpisodeListItem>> {
    return this.http.get<PagedResult<EpisodeListItem>>(`${this.apiUrl}/episodes/latest`, {
      params: { page, pageSize }
    }).pipe(
      catchError(() => of({ items: [], totalCount: 0, page: 1, pageSize: 20, totalPages: 0, hasNextPage: false, hasPreviousPage: false }))
    );
  }

  getTrendingEpisodes(count = 20): Observable<EpisodeListItem[]> {
    return this.http.get<EpisodeListItem[]>(`${this.apiUrl}/episodes/trending`, { params: { count } }).pipe(
      catchError(() => of([]))
    );
  }

  initiateEpisodeUpload(podcastId: string, request: CreateEpisodeRequest): Observable<{ episodeId: string; uploadUrl: string }> {
    return this.http.post<{ episodeId: string; uploadUrl: string }>(`${this.apiUrl}/${podcastId}/episodes/upload`, request);
  }

  completeEpisodeUpload(podcastId: string, episodeId: string, audioUrl: string, videoUrl?: string): Observable<Episode> {
    return this.http.post<Episode>(`${this.apiUrl}/${podcastId}/episodes/${episodeId}/complete-upload`, { audioUrl, videoUrl });
  }

  publishEpisode(podcastId: string, episodeId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${podcastId}/episodes/${episodeId}/publish`, {});
  }

  scheduleEpisode(podcastId: string, episodeId: string, publishAt: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${podcastId}/episodes/${episodeId}/schedule`, { publishAt });
  }

  deleteEpisode(podcastId: string, episodeId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${podcastId}/episodes/${episodeId}`);
  }

  // Playback
  recordPlay(episodeId: string, sessionId?: string, deviceType?: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/episodes/${episodeId}/play`, { sessionId, deviceType }).pipe(
      catchError(() => of(undefined))
    );
  }

  updateProgress(podcastId: string, episodeId: string, currentPosition: number, listenPercent: number): Observable<void> {
    const mins = Math.floor(currentPosition / 60);
    const secs = Math.floor(currentPosition % 60);
    const position = `00:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    return this.http.post<void>(`${this.apiUrl}/${podcastId}/episodes/${episodeId}/progress`, {
      currentPosition: position,
      listenDuration: position,
      listenPercent,
      isCompleted: listenPercent >= 95
    }).pipe(catchError(() => of(undefined)));
  }

  // Chapters
  getChapters(podcastId: string, episodeId: string): Observable<EpisodeChapter[]> {
    return this.http.get<EpisodeChapter[]>(`${this.apiUrl}/${podcastId}/episodes/${episodeId}/chapters`).pipe(
      catchError(() => of([]))
    );
  }

  // ============ SUBSCRIPTIONS ============

  getSubscriptions(page = 1, pageSize = 20): Observable<PagedResult<PodcastListItem>> {
    return this.http.get<PagedResult<PodcastListItem>>(`${this.apiUrl}/subscriptions`, {
      params: { page, pageSize }
    }).pipe(
      catchError(() => of({ items: [], totalCount: 0, page: 1, pageSize: 20, totalPages: 0, hasNextPage: false, hasPreviousPage: false }))
    );
  }

  subscribe(podcastId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${podcastId}/subscribe`, {});
  }

  unsubscribe(podcastId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${podcastId}/subscribe`);
  }

  isSubscribed(podcastId: string): Observable<{ isSubscribed: boolean }> {
    return this.http.get<{ isSubscribed: boolean }>(`${this.apiUrl}/${podcastId}/subscription`).pipe(
      catchError(() => of({ isSubscribed: false }))
    );
  }

  // ============ RATINGS & REACTIONS ============

  getRatings(podcastId: string): Observable<RatingSummary> {
    return this.http.get<RatingSummary>(`${this.apiUrl}/${podcastId}/ratings`);
  }

  ratePodcast(podcastId: string, rating: number, review?: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${podcastId}/ratings`, { rating, review });
  }

  getReactions(episodeId: string): Observable<ReactionSummary> {
    return this.http.get<ReactionSummary>(`${this.apiUrl}/episodes/${episodeId}/reactions`).pipe(
      catchError(() => of({ likes: 0, dislikes: 0 }))
    );
  }

  reactToEpisode(episodeId: string, reactionType: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/episodes/${episodeId}/reactions/${reactionType}`, {});
  }

  removeReaction(episodeId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/episodes/${episodeId}/reactions`);
  }

  // ============ COMMENTS ============

  getComments(episodeId: string, page = 1, pageSize = 20): Observable<PagedResult<EpisodeComment>> {
    return this.http.get<PagedResult<EpisodeComment>>(`${this.apiUrl}/episodes/${episodeId}/comments`, {
      params: { page, pageSize }
    }).pipe(
      catchError(() => of({ items: [], totalCount: 0, page: 1, pageSize: 20, totalPages: 0, hasNextPage: false, hasPreviousPage: false }))
    );
  }

  addComment(episodeId: string, content: string, timestamp?: string, parentId?: string): Observable<EpisodeComment> {
    return this.http.post<EpisodeComment>(`${this.apiUrl}/episodes/${episodeId}/comments`, {
      content, timestamp, parentId
    });
  }

  deleteComment(commentId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/comments/${commentId}`);
  }

  // ============ SHARES ============

  shareEpisode(episodeId: string, platform: string): Observable<{ shareUrl: string }> {
    return this.http.post<{ shareUrl: string }>(`${this.apiUrl}/episodes/${episodeId}/share`, { platform });
  }

  // ============ LIBRARY ============

  getSavedEpisodes(page = 1, pageSize = 20): Observable<PagedResult<EpisodeListItem>> {
    return this.http.get<PagedResult<EpisodeListItem>>(`${this.apiUrl}/library/saved`, {
      params: { page, pageSize }
    }).pipe(
      catchError(() => of({ items: [], totalCount: 0, page: 1, pageSize: 20, totalPages: 0, hasNextPage: false, hasPreviousPage: false }))
    );
  }

  saveEpisode(episodeId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/library/saved/${episodeId}`, {});
  }

  unsaveEpisode(episodeId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/library/saved/${episodeId}`);
  }

  getHistory(page = 1, pageSize = 20): Observable<PagedResult<ListenHistory>> {
    return this.http.get<PagedResult<ListenHistory>>(`${this.apiUrl}/library/history`, {
      params: { page, pageSize }
    }).pipe(
      catchError(() => of({ items: [], totalCount: 0, page: 1, pageSize: 20, totalPages: 0, hasNextPage: false, hasPreviousPage: false }))
    );
  }

  clearHistory(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/library/history`);
  }

  getQueue(): Observable<QueueItem[]> {
    return this.http.get<QueueItem[]>(`${this.apiUrl}/library/queue`).pipe(
      catchError(() => of([]))
    );
  }

  addToQueue(episodeId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/library/queue/${episodeId}`, {});
  }

  removeFromQueue(episodeId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/library/queue/${episodeId}`);
  }

  clearQueue(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/library/queue`);
  }

  // ============ HELPERS ============

  getCategoryName(category: PodcastCategory): string {
    const names: Record<PodcastCategory, string> = {
      [PodcastCategory.Automotive]: 'Automotive',
      [PodcastCategory.Classic]: 'Classic Cars',
      [PodcastCategory.Electric]: 'Electric Vehicles',
      [PodcastCategory.Racing]: 'Racing',
      [PodcastCategory.Maintenance]: 'Maintenance & DIY',
      [PodcastCategory.Business]: 'Auto Business',
      [PodcastCategory.News]: 'News',
      [PodcastCategory.Reviews]: 'Reviews',
      [PodcastCategory.DIY]: 'DIY',
      [PodcastCategory.Lifestyle]: 'Lifestyle'
    };
    return names[category] || 'Other';
  }

  formatDuration(duration: string): string {
    if (!duration) return '0:00';
    const parts = duration.split(':');
    if (parts.length === 3) {
      const hours = parseInt(parts[0]);
      const mins = parseInt(parts[1]);
      const secs = parseInt(parts[2]);
      if (hours > 0) return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    return duration;
  }
}
