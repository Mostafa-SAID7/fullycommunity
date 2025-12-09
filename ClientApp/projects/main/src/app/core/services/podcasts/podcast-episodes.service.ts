import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PagedResult } from '../../types/common.types';
import {
  PodcastEpisode,
  EpisodeListItem,
  EpisodeSearchRequest,
  CreateEpisodeRequest,
  UpdateEpisodeRequest,
  EpisodeUploadResponse,
  CompleteEpisodeUploadRequest,
  RecordPlayRequest,
  ListenProgressRequest,
  ScheduleRequest,
  CreateChapterRequest,
  UpdateChapterRequest,
  EpisodeChapter
} from '../../interfaces/podcasts';

@Injectable({
  providedIn: 'root'
})
export class PodcastEpisodesService {
  private readonly apiUrl = `${environment.apiUrl}/podcasts`;

  constructor(private http: HttpClient) {}

  /**
   * Get episode by ID
   */
  getById(episodeId: string): Observable<PodcastEpisode> {
    return this.http.get<PodcastEpisode>(`${this.apiUrl}/episodes/${episodeId}`);
  }

  /**
   * Get episode by slug
   */
  getBySlug(podcastId: string, slug: string): Observable<PodcastEpisode> {
    return this.http.get<PodcastEpisode>(`${this.apiUrl}/${podcastId}/episodes/slug/${slug}`);
  }

  /**
   * Get episodes for a podcast
   */
  getByPodcast(podcastId: string, request: EpisodeSearchRequest): Observable<PagedResult<EpisodeListItem>> {
    let params = new HttpParams();
    
    if (request.query) params = params.set('query', request.query);
    if (request.type !== null && request.type !== undefined) params = params.set('type', request.type.toString());
    if (request.seasonNumber !== null) params = params.set('seasonNumber', request.seasonNumber.toString());
    if (request.sortBy) params = params.set('sortBy', request.sortBy);
    params = params.set('page', request.page.toString());
    params = params.set('pageSize', request.pageSize.toString());
    
    return this.http.get<PagedResult<EpisodeListItem>>(`${this.apiUrl}/${podcastId}/episodes`, { params });
  }

  /**
   * Get latest episodes
   */
  getLatest(pageSize: number = 20): Observable<EpisodeListItem[]> {
    return this.http.get<EpisodeListItem[]>(`${this.apiUrl}/episodes/latest`, {
      params: { pageSize: pageSize.toString() }
    });
  }

  /**
   * Get trending episodes
   */
  getTrending(pageSize: number = 20): Observable<EpisodeListItem[]> {
    return this.http.get<EpisodeListItem[]>(`${this.apiUrl}/episodes/trending`, {
      params: { pageSize: pageSize.toString() }
    });
  }

  /**
   * Create episode
   */
  create(podcastId: string, request: CreateEpisodeRequest): Observable<PodcastEpisode> {
    return this.http.post<PodcastEpisode>(`${this.apiUrl}/${podcastId}/episodes`, request);
  }

  /**
   * Update episode
   */
  update(episodeId: string, request: UpdateEpisodeRequest): Observable<PodcastEpisode> {
    return this.http.put<PodcastEpisode>(`${this.apiUrl}/episodes/${episodeId}`, request);
  }

  /**
   * Delete episode
   */
  delete(episodeId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/episodes/${episodeId}`);
  }

  /**
   * Get upload URL for episode
   */
  getUploadUrl(podcastId: string): Observable<EpisodeUploadResponse> {
    return this.http.post<EpisodeUploadResponse>(`${this.apiUrl}/${podcastId}/episodes/upload-url`, {});
  }

  /**
   * Complete episode upload
   */
  completeUpload(episodeId: string, request: CompleteEpisodeUploadRequest): Observable<PodcastEpisode> {
    return this.http.post<PodcastEpisode>(`${this.apiUrl}/episodes/${episodeId}/complete-upload`, request);
  }

  /**
   * Schedule episode
   */
  schedule(episodeId: string, request: ScheduleRequest): Observable<PodcastEpisode> {
    return this.http.post<PodcastEpisode>(`${this.apiUrl}/episodes/${episodeId}/schedule`, request);
  }

  /**
   * Publish episode immediately
   */
  publish(episodeId: string): Observable<PodcastEpisode> {
    return this.http.post<PodcastEpisode>(`${this.apiUrl}/episodes/${episodeId}/publish`, {});
  }

  /**
   * Record play
   */
  recordPlay(episodeId: string, request: RecordPlayRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/episodes/${episodeId}/play`, request);
  }

  /**
   * Track listen progress
   */
  trackProgress(episodeId: string, request: ListenProgressRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/episodes/${episodeId}/progress`, request);
  }

  /**
   * Add chapter
   */
  addChapter(episodeId: string, request: CreateChapterRequest): Observable<EpisodeChapter> {
    return this.http.post<EpisodeChapter>(`${this.apiUrl}/episodes/${episodeId}/chapters`, request);
  }

  /**
   * Update chapter
   */
  updateChapter(episodeId: string, chapterId: string, request: UpdateChapterRequest): Observable<EpisodeChapter> {
    return this.http.put<EpisodeChapter>(`${this.apiUrl}/episodes/${episodeId}/chapters/${chapterId}`, request);
  }

  /**
   * Delete chapter
   */
  deleteChapter(episodeId: string, chapterId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/episodes/${episodeId}/chapters/${chapterId}`);
  }

  /**
   * Get related episodes
   */
  getRelated(episodeId: string, limit: number = 10): Observable<EpisodeListItem[]> {
    return this.http.get<EpisodeListItem[]>(`${this.apiUrl}/episodes/${episodeId}/related`, {
      params: { limit: limit.toString() }
    });
  }
}
