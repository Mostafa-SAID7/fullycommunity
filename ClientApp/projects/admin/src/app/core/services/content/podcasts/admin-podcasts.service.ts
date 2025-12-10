import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import {
  AdminPodcastShow,
  AdminPodcastEpisode,
  AdminLiveRecording,
  PodcastsFilter,
  PodcastsStatistics
} from '../../../interfaces/content/podcasts/admin-podcasts.interface';

@Injectable({
  providedIn: 'root'
})
export class AdminPodcastsService {
  private readonly apiUrl = `${environment.apiUrl}/admin/podcasts`;

  constructor(private http: HttpClient) {}

  /**
   * Get podcast shows
   */
  getShows(filter: PodcastsFilter, page: number = 1, pageSize: number = 20): Observable<{ shows: AdminPodcastShow[], total: number }> {
    let params = this.buildFilterParams(filter, page, pageSize);
    return this.http.get<{ shows: AdminPodcastShow[], total: number }>(`${this.apiUrl}/shows`, { params });
  }

  /**
   * Get podcast episodes
   */
  getEpisodes(filter: PodcastsFilter, page: number = 1, pageSize: number = 20): Observable<{ episodes: AdminPodcastEpisode[], total: number }> {
    let params = this.buildFilterParams(filter, page, pageSize);
    return this.http.get<{ episodes: AdminPodcastEpisode[], total: number }>(`${this.apiUrl}/episodes`, { params });
  }

  /**
   * Get live recordings
   */
  getLiveRecordings(filter: PodcastsFilter, page: number = 1, pageSize: number = 20): Observable<{ recordings: AdminLiveRecording[], total: number }> {
    let params = this.buildFilterParams(filter, page, pageSize);
    return this.http.get<{ recordings: AdminLiveRecording[], total: number }>(`${this.apiUrl}/live-recordings`, { params });
  }

  /**
   * Get show by ID
   */
  getShow(showId: string): Observable<AdminPodcastShow> {
    return this.http.get<AdminPodcastShow>(`${this.apiUrl}/shows/${showId}`);
  }

  /**
   * Get episode by ID
   */
  getEpisode(episodeId: string): Observable<AdminPodcastEpisode> {
    return this.http.get<AdminPodcastEpisode>(`${this.apiUrl}/episodes/${episodeId}`);
  }

  /**
   * Approve show
   */
  approveShow(showId: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/shows/${showId}/approve`, {});
  }

  /**
   * Suspend show
   */
  suspendShow(showId: string, reason: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/shows/${showId}/suspend`, { reason });
  }

  /**
   * Archive show
   */
  archiveShow(showId: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/shows/${showId}/archive`, {});
  }

  /**
   * Delete show
   */
  deleteShow(showId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/shows/${showId}`);
  }

  /**
   * Approve episode
   */
  approveEpisode(episodeId: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/episodes/${episodeId}/approve`, {});
  }

  /**
   * Reject episode
   */
  rejectEpisode(episodeId: string, reason: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/episodes/${episodeId}/reject`, { reason });
  }

  /**
   * Flag episode
   */
  flagEpisode(episodeId: string, reason: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/episodes/${episodeId}/flag`, { reason });
  }

  /**
   * Hide episode
   */
  hideEpisode(episodeId: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/episodes/${episodeId}/hide`, {});
  }

  /**
   * Delete episode
   */
  deleteEpisode(episodeId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/episodes/${episodeId}`);
  }

  /**
   * Enable monetization
   */
  enableMonetization(showId: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/shows/${showId}/monetization/enable`, {});
  }

  /**
   * Disable monetization
   */
  disableMonetization(showId: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/shows/${showId}/monetization/disable`, {});
  }

  /**
   * End live recording
   */
  endLiveRecording(recordingId: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/live-recordings/${recordingId}/end`, {});
  }

  /**
   * Suspend live recording
   */
  suspendLiveRecording(recordingId: string, reason: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/live-recordings/${recordingId}/suspend`, { reason });
  }

  /**
   * Get podcasts statistics
   */
  getStatistics(): Observable<PodcastsStatistics> {
    return this.http.get<PodcastsStatistics>(`${this.apiUrl}/statistics`);
  }

  /**
   * Get moderation queue
   */
  getModerationQueue(page: number = 1, pageSize: number = 20): Observable<any> {
    return this.http.get(`${this.apiUrl}/moderation-queue`, {
      params: {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    });
  }

  /**
   * Get reported content
   */
  getReportedContent(page: number = 1, pageSize: number = 20): Observable<any> {
    return this.http.get(`${this.apiUrl}/reported`, {
      params: {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    });
  }

  /**
   * Export podcasts data
   */
  exportData(filter: PodcastsFilter, format: string = 'csv'): Observable<Blob> {
    let params = this.buildFilterParams(filter, 1, 10000);
    params = params.set('format', format);
    
    return this.http.get(`${this.apiUrl}/export`, {
      params,
      responseType: 'blob'
    });
  }

  /**
   * Build filter parameters
   */
  private buildFilterParams(filter: PodcastsFilter, page: number, pageSize: number): HttpParams {
    let params = new HttpParams();
    params = params.set('page', page.toString());
    params = params.set('pageSize', pageSize.toString());
    
    if (filter.search) params = params.set('search', filter.search);
    if (filter.contentType !== null && filter.contentType !== undefined) params = params.set('contentType', filter.contentType.toString());
    if (filter.status !== null && filter.status !== undefined) params = params.set('status', filter.status.toString());
    if (filter.moderationStatus !== null && filter.moderationStatus !== undefined) params = params.set('moderationStatus', filter.moderationStatus.toString());
    if (filter.showId) params = params.set('showId', filter.showId);
    if (filter.category) params = params.set('category', filter.category);
    if (filter.language) params = params.set('language', filter.language);
    if (filter.dateFrom) params = params.set('dateFrom', filter.dateFrom);
    if (filter.dateTo) params = params.set('dateTo', filter.dateTo);
    if (filter.hasReports !== null && filter.hasReports !== undefined) params = params.set('hasReports', filter.hasReports.toString());
    if (filter.isFlagged !== null && filter.isFlagged !== undefined) params = params.set('isFlagged', filter.isFlagged.toString());
    if (filter.isExplicit !== null && filter.isExplicit !== undefined) params = params.set('isExplicit', filter.isExplicit.toString());
    if (filter.isMonetized !== null && filter.isMonetized !== undefined) params = params.set('isMonetized', filter.isMonetized.toString());
    
    return params;
  }
}