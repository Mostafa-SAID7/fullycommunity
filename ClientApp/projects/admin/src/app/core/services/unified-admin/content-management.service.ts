/**
 * Unified Content Management Service
 * Service for advanced content management operations
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseAdminService } from '../base/base-admin.service';

import {
  AdvancedContentManagement,
  ContentListResponse,
  ContentDetailsResponse,
  ContentActionResponse,
  ContentStatisticsResponse,
  ContentModerationQueueResponse,
  ContentExportResponse,
  ContentModerationRequest,
  BulkContentActionRequest,
  ContentFilterRequest,
  ContentUpdateRequest,
  MediaUploadRequest,
  MediaUpdateRequest,
  ContentAppealRequest,
  ContentReportRequest
} from '../../interfaces/unified-admin';

@Injectable({
  providedIn: 'root'
})
export class UnifiedContentManagementService extends BaseAdminService {
  private readonly apiPath = '/unified/content';

  constructor(http: HttpClient) {
    super(http);
  }

  /**
   * Get content with filtering and pagination
   */
  getContent(filter: ContentFilterRequest): Observable<ContentListResponse> {
    const params = this.buildParams(filter);
    return this.get<ContentListResponse>(this.apiPath, params);
  }

  /**
   * Get content details by ID
   */
  getContentDetails(contentId: string): Observable<ContentDetailsResponse> {
    return this.get<ContentDetailsResponse>(`${this.apiPath}/${contentId}`);
  }

  /**
   * Update content
   */
  updateContent(request: ContentUpdateRequest): Observable<AdvancedContentManagement> {
    return this.put<AdvancedContentManagement>(`${this.apiPath}/${request.contentId}`, request);
  }

  /**
   * Delete content
   */
  deleteContent(contentId: string, reason?: string): Observable<void> {
    const params = reason ? this.buildParams({ reason }) : undefined;
    return this.delete<void>(`${this.apiPath}/${contentId}`, params);
  }

  /**
   * Perform content moderation action
   */
  moderateContent(request: ContentModerationRequest): Observable<ContentActionResponse> {
    return this.post<ContentActionResponse>(`${this.apiPath}/moderation`, request);
  }

  /**
   * Perform bulk content actions
   */
  performBulkContentAction(request: BulkContentActionRequest): Observable<ContentActionResponse> {
    return this.bulkOperation(`${this.apiPath}/bulk-actions`, request.contentIds, request.action.toString(), {
      reason: request.reason,
      notes: request.notes,
      notifyAuthors: request.notifyAuthors
    });
  }

  /**
   * Get moderation queue
   */
  getModerationQueue(page: number = 1, pageSize: number = 20, priority?: string): Observable<ContentModerationQueueResponse> {
    const params = this.buildParams({ page, pageSize, priority });
    return this.get<ContentModerationQueueResponse>(`${this.apiPath}/moderation-queue`, params);
  }

  /**
   * Approve content
   */
  approveContent(contentId: string, notes?: string): Observable<void> {
    return this.post<void>(`${this.apiPath}/${contentId}/approve`, { notes });
  }

  /**
   * Reject content
   */
  rejectContent(contentId: string, reason: string, notes?: string): Observable<void> {
    return this.post<void>(`${this.apiPath}/${contentId}/reject`, { reason, notes });
  }

  /**
   * Flag content
   */
  flagContent(contentId: string, reason: string, severity?: string): Observable<void> {
    return this.post<void>(`${this.apiPath}/${contentId}/flag`, { reason, severity });
  }

  /**
   * Hide content
   */
  hideContent(contentId: string, reason?: string): Observable<void> {
    return this.post<void>(`${this.apiPath}/${contentId}/hide`, { reason });
  }

  /**
   * Restore content
   */
  restoreContent(contentId: string, notes?: string): Observable<void> {
    return this.post<void>(`${this.apiPath}/${contentId}/restore`, { notes });
  }

  /**
   * Archive content
   */
  archiveContent(contentId: string, reason?: string): Observable<void> {
    return this.post<void>(`${this.apiPath}/${contentId}/archive`, { reason });
  }

  /**
   * Feature content
   */
  featureContent(contentId: string, duration?: number): Observable<void> {
    return this.post<void>(`${this.apiPath}/${contentId}/feature`, { duration });
  }

  /**
   * Unfeature content
   */
  unfeatureContent(contentId: string): Observable<void> {
    return this.post<void>(`${this.apiPath}/${contentId}/unfeature`, {});
  }

  /**
   * Upload media
   */
  uploadMedia(request: MediaUploadRequest): Observable<any> {
    const additionalData = {
      type: request.type.toString(),
      alt: request.alt,
      caption: request.caption,
      contentId: request.contentId
    };
    return this.uploadFile(`${this.apiPath}/media/upload`, request.file, additionalData);
  }

  /**
   * Update media
   */
  updateMedia(request: MediaUpdateRequest): Observable<void> {
    return this.put<void>(`${this.apiPath}/media/${request.mediaId}`, request);
  }

  /**
   * Delete media
   */
  deleteMedia(mediaId: string): Observable<void> {
    return this.delete<void>(`${this.apiPath}/media/${mediaId}`);
  }

  /**
   * Submit content appeal
   */
  submitContentAppeal(request: ContentAppealRequest): Observable<void> {
    return this.post<void>(`${this.apiPath}/appeals`, request);
  }

  /**
   * Review content appeal
   */
  reviewContentAppeal(appealId: string, approved: boolean, response?: string): Observable<void> {
    return this.post<void>(`${this.apiPath}/appeals/${appealId}/review`, { approved, response });
  }

  /**
   * Report content
   */
  reportContent(request: ContentReportRequest): Observable<void> {
    return this.post<void>(`${this.apiPath}/reports`, request);
  }

  /**
   * Get content reports
   */
  getContentReports(contentId?: string, page: number = 1, pageSize: number = 20): Observable<any> {
    const params = this.buildParams({ contentId, page, pageSize });
    return this.get(`${this.apiPath}/reports`, params);
  }

  /**
   * Get content statistics
   */
  getContentStatistics(): Observable<ContentStatisticsResponse> {
    return this.getStatistics<ContentStatisticsResponse>(`${this.apiPath}/statistics`);
  }

  /**
   * Get content moderation history
   */
  getContentModerationHistory(contentId: string): Observable<any[]> {
    return this.get<any[]>(`${this.apiPath}/${contentId}/moderation-history`);
  }

  /**
   * Get content version history
   */
  getContentVersionHistory(contentId: string): Observable<any[]> {
    return this.get<any[]>(`${this.apiPath}/${contentId}/version-history`);
  }

  /**
   * Restore content version
   */
  restoreContentVersion(contentId: string, versionId: string): Observable<void> {
    return this.post<void>(`${this.apiPath}/${contentId}/versions/${versionId}/restore`, {});
  }

  /**
   * Schedule content publication
   */
  scheduleContentPublication(contentId: string, publishAt: string, unpublishAt?: string): Observable<void> {
    return this.post<void>(`${this.apiPath}/${contentId}/schedule`, { publishAt, unpublishAt });
  }

  /**
   * Cancel scheduled publication
   */
  cancelScheduledPublication(contentId: string): Observable<void> {
    return this.delete<void>(`${this.apiPath}/${contentId}/schedule`);
  }

  /**
   * Export content data
   */
  exportContent(filter: ContentFilterRequest, format: 'csv' | 'excel' = 'csv'): Observable<ContentExportResponse> {
    return this.post<ContentExportResponse>(`${this.apiPath}/export`, { filter, format });
  }

  /**
   * Get content categories
   */
  getContentCategories(): Observable<any[]> {
    return this.get<any[]>(`${this.apiPath}/categories`);
  }

  /**
   * Get content tags
   */
  getContentTags(search?: string): Observable<any[]> {
    const params = search ? this.buildParams({ search }) : undefined;
    return this.get<any[]>(`${this.apiPath}/tags`, params);
  }

  /**
   * Search content
   */
  searchContent(query: string, limit: number = 10): Observable<AdvancedContentManagement[]> {
    return this.search<AdvancedContentManagement>(`${this.apiPath}/search`, query, limit);
  }
}