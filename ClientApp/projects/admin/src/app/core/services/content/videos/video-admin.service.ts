/**
 * Video Admin Service
 * Service for comprehensive video administration and management
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { BaseAdminService } from '../../base/base-admin.service';
import {
  VideoAdmin,
  VideoStats,
  VideoCategory
} from '../../../interfaces/content/videos/components/video-core';
import {
  VideoAdminFilter,
  VideoExportRequest
} from '../../../interfaces/content/videos/requests/video-filter-requests';
import {
  VideoListResponse
} from '../../../interfaces/content/videos/responses/video-list-responses';
import {
  VideoDetailsResponse
} from '../../../interfaces/content/videos/responses/video-details-responses';
import {
  VideoModerationRequest,
  BulkVideoActionRequest
} from '../../../interfaces/content/videos/requests/video-moderation-requests';

import {
  ModerationAction,
  VideoStatus,
  ProcessingStatus
} from '../../../interfaces/content/videos/enums/video-enums';
import { ActionResponse } from '../../../interfaces/common/base.interface';

@Injectable({
  providedIn: 'root'
})
export class VideoAdminService extends BaseAdminService {
  private readonly apiPath = '/admin/videos';
  
  // Real-time data subjects
  private videoStatsSubject = new BehaviorSubject<VideoStats | null>(null);
  private categoriesSubject = new BehaviorSubject<VideoCategory[]>([]);
  private processingVideosSubject = new BehaviorSubject<VideoAdmin[]>([]);
  
  // Public observables
  public videoStats$ = this.videoStatsSubject.asObservable();
  public categories$ = this.categoriesSubject.asObservable();
  public processingVideos$ = this.processingVideosSubject.asObservable();

  constructor(http: HttpClient) {
    super(http);
    this.initializeRealTimeUpdates();
  }

  /**
   * Get videos with advanced filtering and pagination
   */
  getVideos(filter: VideoAdminFilter): Observable<VideoListResponse> {
    const params = this.buildParams(filter);
    return this.get<VideoListResponse>(this.apiPath, params).pipe(
      tap(response => {
        if (response.stats) {
          this.videoStatsSubject.next(response.stats);
        }
        if (response.categories) {
          this.categoriesSubject.next(response.categories);
        }
      })
    );
  }

  /**
   * Get video details with analytics and moderation history
   */
  getVideoDetails(videoId: string): Observable<VideoDetailsResponse> {
    return this.get<VideoDetailsResponse>(`${this.apiPath}/${videoId}/details`);
  }

  /**
   * Get video statistics
   */
  getVideoStats(timeRange?: string): Observable<VideoStats> {
    return this.getStatistics<VideoStats>(`${this.apiPath}/statistics`, timeRange).pipe(
      tap(stats => this.videoStatsSubject.next(stats))
    );
  }

  /**
   * Get video categories
   */
  getCategories(): Observable<VideoCategory[]> {
    return this.get<VideoCategory[]>(`${this.apiPath}/categories`).pipe(
      tap(categories => this.categoriesSubject.next(categories))
    );
  }

  /**
   * Moderate single video
   */
  moderateVideo(request: VideoModerationRequest): Observable<ActionResponse> {
    return this.post<ActionResponse>(`${this.apiPath}/moderate`, request).pipe(
      tap(() => this.refreshStats())
    );
  }

  /**
   * Perform bulk video actions
   */
  performBulkAction(request: BulkVideoActionRequest): Observable<ActionResponse> {
    return this.post<ActionResponse>(`${this.apiPath}/bulk-moderate`, request).pipe(
      tap(() => this.refreshStats())
    );
  }

  /**
   * Approve video
   */
  approveVideo(videoId: string, notes?: string): Observable<ActionResponse> {
    return this.moderateVideo({
      videoId,
      action: ModerationAction.Approve,
      reason: 'Video approved by admin',
      notes,
      notifyCreator: true
    });
  }

  /**
   * Reject video
   */
  rejectVideo(videoId: string, reason: string, notes?: string): Observable<ActionResponse> {
    return this.moderateVideo({
      videoId,
      action: ModerationAction.Reject,
      reason,
      notes,
      notifyCreator: true,
      sendEmail: true
    });
  }

  /**
   * Flag video
   */
  flagVideo(videoId: string, reason: string, notes?: string): Observable<ActionResponse> {
    return this.moderateVideo({
      videoId,
      action: ModerationAction.Flag,
      reason,
      notes,
      notifyCreator: true
    });
  }

  /**
   * Remove video
   */
  removeVideo(videoId: string, reason: string, notes?: string): Observable<ActionResponse> {
    return this.moderateVideo({
      videoId,
      action: ModerationAction.Remove,
      reason,
      notes,
      notifyCreator: true,
      sendEmail: true
    });
  }

  /**
   * Restore video
   */
  restoreVideo(videoId: string, notes?: string): Observable<ActionResponse> {
    return this.moderateVideo({
      videoId,
      action: ModerationAction.Restore,
      reason: 'Video restored by admin',
      notes,
      notifyCreator: true
    });
  }

  /**
   * Archive video
   */
  archiveVideo(videoId: string, reason?: string): Observable<ActionResponse> {
    return this.moderateVideo({
      videoId,
      action: ModerationAction.Archive,
      reason: reason || 'Video archived by admin',
      notifyCreator: false
    });
  }

  /**
   * Feature video
   */
  featureVideo(videoId: string, duration?: number): Observable<ActionResponse> {
    return this.moderateVideo({
      videoId,
      action: ModerationAction.Feature,
      reason: 'Video featured by admin',
      duration,
      notifyCreator: true
    });
  }

  /**
   * Unfeature video
   */
  unfeatureVideo(videoId: string): Observable<ActionResponse> {
    return this.moderateVideo({
      videoId,
      action: ModerationAction.Unfeature,
      reason: 'Video unfeatured by admin',
      notifyCreator: false
    });
  }

  /**
   * Enable monetization for video
   */
  enableMonetization(videoId: string): Observable<ActionResponse> {
    return this.moderateVideo({
      videoId,
      action: ModerationAction.Monetize,
      reason: 'Monetization enabled by admin',
      notifyCreator: true
    });
  }

  /**
   * Disable monetization for video
   */
  disableMonetization(videoId: string, reason: string): Observable<ActionResponse> {
    return this.moderateVideo({
      videoId,
      action: ModerationAction.Demonetize,
      reason,
      notifyCreator: true,
      sendEmail: true
    });
  }

  /**
   * Apply age restriction
   */
  applyAgeRestriction(videoId: string, reason: string): Observable<ActionResponse> {
    return this.moderateVideo({
      videoId,
      action: ModerationAction.AgeRestrict,
      reason,
      notifyCreator: true
    });
  }

  /**
   * Remove age restriction
   */
  removeAgeRestriction(videoId: string): Observable<ActionResponse> {
    return this.moderateVideo({
      videoId,
      action: ModerationAction.RemoveAgeRestriction,
      reason: 'Age restriction removed by admin',
      notifyCreator: true
    });
  }

  /**
   * Get videos pending review
   */
  getPendingVideos(page: number = 1, pageSize: number = 20): Observable<VideoListResponse> {
    return this.getVideos({
      status: VideoStatus.Pending,
      page,
      pageSize,
      sortBy: 'uploadedAt',
      sortOrder: 'asc'
    });
  }

  /**
   * Get flagged videos
   */
  getFlaggedVideos(page: number = 1, pageSize: number = 20): Observable<VideoListResponse> {
    return this.getVideos({
      status: VideoStatus.Flagged,
      page,
      pageSize,
      sortBy: 'flagCount',
      sortOrder: 'desc'
    });
  }

  /**
   * Get processing videos
   */
  getProcessingVideos(): Observable<VideoAdmin[]> {
    return this.get<VideoAdmin[]>(`${this.apiPath}/processing`).pipe(
      tap(videos => this.processingVideosSubject.next(videos))
    );
  }

  /**
   * Get video analytics
   */
  getVideoAnalytics(videoId: string, timeRange?: string): Observable<any> {
    const params = timeRange ? this.buildParams({ timeRange }) : undefined;
    return this.get(`${this.apiPath}/${videoId}/analytics`, params);
  }

  /**
   * Get video comments
   */
  getVideoComments(videoId: string, page: number = 1, pageSize: number = 20): Observable<any> {
    const params = this.buildParams({ page, pageSize });
    return this.get(`${this.apiPath}/${videoId}/comments`, params);
  }

  /**
   * Moderate video comment
   */
  moderateComment(videoId: string, commentId: string, action: string, reason?: string): Observable<ActionResponse> {
    return this.post<ActionResponse>(`${this.apiPath}/${videoId}/comments/${commentId}/moderate`, {
      action,
      reason
    });
  }

  /**
   * Get video reports
   */
  getVideoReports(videoId?: string, page: number = 1, pageSize: number = 20): Observable<any> {
    const params = this.buildParams({ videoId, page, pageSize });
    return this.get(`${this.apiPath}/reports`, params);
  }

  /**
   * Resolve video report
   */
  resolveReport(reportId: string, resolution: string, notes?: string): Observable<ActionResponse> {
    return this.post<ActionResponse>(`${this.apiPath}/reports/${reportId}/resolve`, {
      resolution,
      notes
    });
  }

  /**
   * Get moderation queue
   */
  getModerationQueue(priority?: string, page: number = 1, pageSize: number = 20): Observable<any> {
    const params = this.buildParams({ priority, page, pageSize });
    return this.get(`${this.apiPath}/moderation-queue`, params);
  }

  /**
   * Export videos
   */
  exportVideos(request: VideoExportRequest): Observable<any> {
    return this.post(`${this.apiPath}/export`, request);
  }

  /**
   * Import videos
   */
  importVideos(file: File): Observable<ActionResponse> {
    return this.uploadFile(`${this.apiPath}/import`, file);
  }

  /**
   * Search videos
   */
  searchVideos(query: string, limit: number = 10): Observable<VideoAdmin[]> {
    return this.search<VideoAdmin>(`${this.apiPath}/search`, query, limit);
  }

  /**
   * Get video thumbnails
   */
  getVideoThumbnails(videoId: string): Observable<string[]> {
    return this.get<string[]>(`${this.apiPath}/${videoId}/thumbnails`);
  }

  /**
   * Update video thumbnail
   */
  updateVideoThumbnail(videoId: string, thumbnailFile: File): Observable<ActionResponse> {
    return this.uploadFile(`${this.apiPath}/${videoId}/thumbnail`, thumbnailFile);
  }

  /**
   * Generate video thumbnail
   */
  generateThumbnail(videoId: string, timestamp: number): Observable<ActionResponse> {
    return this.post<ActionResponse>(`${this.apiPath}/${videoId}/generate-thumbnail`, {
      timestamp
    });
  }

  /**
   * Get video transcription
   */
  getVideoTranscription(videoId: string): Observable<any> {
    return this.get(`${this.apiPath}/${videoId}/transcription`);
  }

  /**
   * Generate video transcription
   */
  generateTranscription(videoId: string, language?: string): Observable<ActionResponse> {
    return this.post<ActionResponse>(`${this.apiPath}/${videoId}/generate-transcription`, {
      language
    });
  }

  /**
   * Get video subtitles
   */
  getVideoSubtitles(videoId: string): Observable<any> {
    return this.get(`${this.apiPath}/${videoId}/subtitles`);
  }

  /**
   * Upload video subtitles
   */
  uploadSubtitles(videoId: string, subtitleFile: File, language: string): Observable<ActionResponse> {
    const formData = new FormData();
    formData.append('file', subtitleFile);
    formData.append('language', language);
    
    return this.uploadFile(`${this.apiPath}/${videoId}/subtitles`, subtitleFile, { language });
  }

  /**
   * Get trending videos
   */
  getTrendingVideos(timeRange: string = '24h', limit: number = 10): Observable<VideoAdmin[]> {
    const params = this.buildParams({ timeRange, limit });
    return this.get<VideoAdmin[]>(`${this.apiPath}/trending`, params);
  }

  /**
   * Get top creators
   */
  getTopCreators(timeRange: string = '30d', limit: number = 10): Observable<any[]> {
    const params = this.buildParams({ timeRange, limit });
    return this.get<any[]>(`${this.apiPath}/top-creators`, params);
  }

  /**
   * Get content warnings for video
   */
  getContentWarnings(videoId: string): Observable<any[]> {
    return this.get<any[]>(`${this.apiPath}/${videoId}/content-warnings`);
  }

  /**
   * Run AI moderation on video
   */
  runAIModeration(videoId: string): Observable<ActionResponse> {
    return this.post<ActionResponse>(`${this.apiPath}/${videoId}/ai-moderation`, {});
  }

  /**
   * Get AI moderation results
   */
  getAIModerationResults(videoId: string): Observable<any> {
    return this.get(`${this.apiPath}/${videoId}/ai-moderation-results`);
  }

  /**
   * Reprocess video
   */
  reprocessVideo(videoId: string, quality?: string): Observable<ActionResponse> {
    return this.post<ActionResponse>(`${this.apiPath}/${videoId}/reprocess`, { quality });
  }

  /**
   * Cancel video processing
   */
  cancelProcessing(videoId: string): Observable<ActionResponse> {
    return this.post<ActionResponse>(`${this.apiPath}/${videoId}/cancel-processing`, {});
  }

  /**
   * Get video processing status
   */
  getProcessingStatus(videoId: string): Observable<{ status: ProcessingStatus; progress: number; errors: string[] }> {
    return this.get(`${this.apiPath}/${videoId}/processing-status`);
  }

  /**
   * Initialize real-time updates
   */
  private initializeRealTimeUpdates(): void {
    // Set up WebSocket or polling for real-time updates
    // This would typically connect to a WebSocket endpoint
    // For now, we'll use periodic polling
    setInterval(() => {
      this.refreshStats();
      this.refreshProcessingVideos();
    }, 30000); // Update every 30 seconds
  }

  /**
   * Refresh video statistics
   */
  private refreshStats(): void {
    this.getVideoStats().subscribe({
      next: (stats) => this.videoStatsSubject.next(stats),
      error: (error) => console.error('Error refreshing video stats:', error)
    });
  }

  /**
   * Refresh processing videos
   */
  private refreshProcessingVideos(): void {
    this.getProcessingVideos().subscribe({
      error: (error) => console.error('Error refreshing processing videos:', error)
    });
  }



  /**
   * Get status badge class
   */
  getStatusBadgeClass(status: VideoStatus): string {
    switch (status) {
      case VideoStatus.Active:
        return 'badge-success';
      case VideoStatus.Pending:
        return 'badge-warning';
      case VideoStatus.Flagged:
        return 'badge-danger';
      case VideoStatus.Removed:
        return 'badge-dark';
      case VideoStatus.Archived:
        return 'badge-secondary';
      case VideoStatus.Processing:
        return 'badge-info';
      case VideoStatus.Live:
        return 'badge-primary';
      default:
        return 'badge-light';
    }
  }
}