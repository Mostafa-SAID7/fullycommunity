import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import {
  AdminVideo,
  AdminVideoChannel,
  AdminLiveStream,
  VideosFilter,
  VideosStatistics
} from '../../../interfaces/content/videos/admin-videos.interface';

@Injectable({
  providedIn: 'root'
})
export class AdminVideosService {
  private readonly apiUrl = `${environment.apiUrl}/admin/videos`;

  constructor(private http: HttpClient) {}

  /**
   * Get videos
   */
  getVideos(filter: VideosFilter, page: number = 1, pageSize: number = 20): Observable<{ videos: AdminVideo[], total: number }> {
    let params = this.buildFilterParams(filter, page, pageSize);
    return this.http.get<{ videos: AdminVideo[], total: number }>(`${this.apiUrl}/videos`, { params });
  }

  /**
   * Get video channels
   */
  getChannels(filter: VideosFilter, page: number = 1, pageSize: number = 20): Observable<{ channels: AdminVideoChannel[], total: number }> {
    let params = this.buildFilterParams(filter, page, pageSize);
    return this.http.get<{ channels: AdminVideoChannel[], total: number }>(`${this.apiUrl}/channels`, { params });
  }

  /**
   * Get live streams
   */
  getLiveStreams(filter: VideosFilter, page: number = 1, pageSize: number = 20): Observable<{ streams: AdminLiveStream[], total: number }> {
    let params = this.buildFilterParams(filter, page, pageSize);
    return this.http.get<{ streams: AdminLiveStream[], total: number }>(`${this.apiUrl}/live-streams`, { params });
  }

  /**
   * Get video by ID
   */
  getVideo(videoId: string): Observable<AdminVideo> {
    return this.http.get<AdminVideo>(`${this.apiUrl}/videos/${videoId}`);
  }

  /**
   * Get channel by ID
   */
  getChannel(channelId: string): Observable<AdminVideoChannel> {
    return this.http.get<AdminVideoChannel>(`${this.apiUrl}/channels/${channelId}`);
  }

  /**
   * Approve video
   */
  approveVideo(videoId: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/videos/${videoId}/approve`, {});
  }

  /**
   * Reject video
   */
  rejectVideo(videoId: string, reason: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/videos/${videoId}/reject`, { reason });
  }

  /**
   * Flag video
   */
  flagVideo(videoId: string, reason: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/videos/${videoId}/flag`, { reason });
  }

  /**
   * Hide video
   */
  hideVideo(videoId: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/videos/${videoId}/hide`, {});
  }

  /**
   * Delete video
   */
  deleteVideo(videoId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/videos/${videoId}`);
  }

  /**
   * Verify channel
   */
  verifyChannel(channelId: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/channels/${channelId}/verify`, {});
  }

  /**
   * Suspend channel
   */
  suspendChannel(channelId: string, reason: string, duration: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/channels/${channelId}/suspend`, { reason, duration });
  }

  /**
   * Terminate channel
   */
  terminateChannel(channelId: string, reason: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/channels/${channelId}/terminate`, { reason });
  }

  /**
   * Enable monetization
   */
  enableMonetization(channelId: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/channels/${channelId}/monetization/enable`, {});
  }

  /**
   * Disable monetization
   */
  disableMonetization(channelId: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/channels/${channelId}/monetization/disable`, {});
  }

  /**
   * End live stream
   */
  endLiveStream(streamId: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/live-streams/${streamId}/end`, {});
  }

  /**
   * Suspend live stream
   */
  suspendLiveStream(streamId: string, reason: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/live-streams/${streamId}/suspend`, { reason });
  }

  /**
   * Get videos statistics
   */
  getStatistics(): Observable<VideosStatistics> {
    return this.http.get<VideosStatistics>(`${this.apiUrl}/statistics`);
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
   * Get reported videos
   */
  getReportedVideos(page: number = 1, pageSize: number = 20): Observable<any> {
    return this.http.get(`${this.apiUrl}/reported`, {
      params: {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    });
  }

  /**
   * Export videos data
   */
  exportData(filter: VideosFilter, format: string = 'csv'): Observable<Blob> {
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
  private buildFilterParams(filter: VideosFilter, page: number, pageSize: number): HttpParams {
    let params = new HttpParams();
    params = params.set('page', page.toString());
    params = params.set('pageSize', pageSize.toString());
    
    if (filter.search) params = params.set('search', filter.search);
    if (filter.contentType !== null && filter.contentType !== undefined) params = params.set('contentType', filter.contentType.toString());
    if (filter.status !== null && filter.status !== undefined) params = params.set('status', filter.status.toString());
    if (filter.moderationStatus !== null && filter.moderationStatus !== undefined) params = params.set('moderationStatus', filter.moderationStatus.toString());
    if (filter.channelId) params = params.set('channelId', filter.channelId);
    if (filter.category) params = params.set('category', filter.category);
    if (filter.dateFrom) params = params.set('dateFrom', filter.dateFrom);
    if (filter.dateTo) params = params.set('dateTo', filter.dateTo);
    if (filter.hasReports !== null && filter.hasReports !== undefined) params = params.set('hasReports', filter.hasReports.toString());
    if (filter.isFlagged !== null && filter.isFlagged !== undefined) params = params.set('isFlagged', filter.isFlagged.toString());
    if (filter.isLiveStream !== null && filter.isLiveStream !== undefined) params = params.set('isLiveStream', filter.isLiveStream.toString());
    if (filter.isMonetized !== null && filter.isMonetized !== undefined) params = params.set('isMonetized', filter.isMonetized.toString());
    
    return params;
  }
}