import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PagedResult } from '../../types/common.types';
import {
  VideoComment,
  VideoReaction,
  SavedVideo,
  VideoCollection,
  VideoReport,
  CreateCommentRequest,
  UpdateCommentRequest,
  AddReactionRequest,
  RemoveReactionRequest,
  SaveVideoRequest,
  UnsaveVideoRequest,
  CreateCollectionRequest,
  UpdateCollectionRequest,
  ReportVideoRequest
} from '../../interfaces/videos';

@Injectable({
  providedIn: 'root'
})
export class VideoEngagementService {
  private readonly apiUrl = `${environment.apiUrl}/videos`;

  constructor(private http: HttpClient) {}

  // ==================== Comments ====================

  /**
   * Get video comments
   */
  getComments(videoId: string, page: number = 1, pageSize: number = 20): Observable<PagedResult<VideoComment>> {
    return this.http.get<PagedResult<VideoComment>>(`${this.apiUrl}/${videoId}/comments`, {
      params: {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    });
  }

  /**
   * Get comment replies
   */
  getReplies(commentId: string, page: number = 1, pageSize: number = 20): Observable<PagedResult<VideoComment>> {
    return this.http.get<PagedResult<VideoComment>>(`${this.apiUrl}/comments/${commentId}/replies`, {
      params: {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    });
  }

  /**
   * Create comment
   */
  createComment(request: CreateCommentRequest): Observable<VideoComment> {
    return this.http.post<VideoComment>(`${this.apiUrl}/${request.videoId}/comments`, request);
  }

  /**
   * Update comment
   */
  updateComment(commentId: string, request: UpdateCommentRequest): Observable<VideoComment> {
    return this.http.put<VideoComment>(`${this.apiUrl}/comments/${commentId}`, request);
  }

  /**
   * Delete comment
   */
  deleteComment(commentId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/comments/${commentId}`);
  }

  /**
   * Like comment
   */
  likeComment(commentId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/comments/${commentId}/like`, {});
  }

  /**
   * Unlike comment
   */
  unlikeComment(commentId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/comments/${commentId}/like`);
  }

  /**
   * Pin comment
   */
  pinComment(commentId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/comments/${commentId}/pin`, {});
  }

  /**
   * Unpin comment
   */
  unpinComment(commentId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/comments/${commentId}/pin`);
  }

  // ==================== Reactions ====================

  /**
   * Add reaction to video
   */
  addReaction(request: AddReactionRequest): Observable<VideoReaction> {
    return this.http.post<VideoReaction>(`${this.apiUrl}/${request.videoId}/reactions`, request);
  }

  /**
   * Remove reaction from video
   */
  removeReaction(request: RemoveReactionRequest): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${request.videoId}/reactions`);
  }

  /**
   * Get video reactions
   */
  getReactions(videoId: string, page: number = 1, pageSize: number = 20): Observable<PagedResult<VideoReaction>> {
    return this.http.get<PagedResult<VideoReaction>>(`${this.apiUrl}/${videoId}/reactions`, {
      params: {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    });
  }

  /**
   * Like video (shorthand for addReaction with Like type)
   */
  like(videoId: string): Observable<VideoReaction> {
    return this.addReaction({ videoId, reactionType: 0 }); // Like = 0
  }

  /**
   * Unlike video
   */
  unlike(videoId: string): Observable<void> {
    return this.removeReaction({ videoId });
  }

  // ==================== Saved Videos ====================

  /**
   * Save video
   */
  saveVideo(request: SaveVideoRequest): Observable<SavedVideo> {
    return this.http.post<SavedVideo>(`${this.apiUrl}/${request.videoId}/save`, request);
  }

  /**
   * Unsave video
   */
  unsaveVideo(request: UnsaveVideoRequest): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${request.videoId}/save`);
  }

  /**
   * Get saved videos
   */
  getSavedVideos(page: number = 1, pageSize: number = 20): Observable<PagedResult<SavedVideo>> {
    return this.http.get<PagedResult<SavedVideo>>(`${this.apiUrl}/saved`, {
      params: {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    });
  }

  /**
   * Get saved videos by collection
   */
  getSavedVideosByCollection(collectionId: string, page: number = 1, pageSize: number = 20): Observable<PagedResult<SavedVideo>> {
    return this.http.get<PagedResult<SavedVideo>>(`${this.apiUrl}/collections/${collectionId}/videos`, {
      params: {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    });
  }

  // ==================== Collections ====================

  /**
   * Get user collections
   */
  getCollections(page: number = 1, pageSize: number = 20): Observable<PagedResult<VideoCollection>> {
    return this.http.get<PagedResult<VideoCollection>>(`${this.apiUrl}/collections`, {
      params: {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    });
  }

  /**
   * Create collection
   */
  createCollection(request: CreateCollectionRequest): Observable<VideoCollection> {
    return this.http.post<VideoCollection>(`${this.apiUrl}/collections`, request);
  }

  /**
   * Update collection
   */
  updateCollection(collectionId: string, request: UpdateCollectionRequest): Observable<VideoCollection> {
    return this.http.put<VideoCollection>(`${this.apiUrl}/collections/${collectionId}`, request);
  }

  /**
   * Delete collection
   */
  deleteCollection(collectionId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/collections/${collectionId}`);
  }

  // ==================== Sharing ====================

  /**
   * Share video
   */
  shareVideo(videoId: string, platform?: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${videoId}/share`, { platform });
  }

  /**
   * Download video
   */
  downloadVideo(videoId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${videoId}/download`, {
      responseType: 'blob'
    });
  }

  // ==================== Reporting ====================

  /**
   * Report video
   */
  reportVideo(request: ReportVideoRequest): Observable<VideoReport> {
    return this.http.post<VideoReport>(`${this.apiUrl}/${request.videoId}/report`, request);
  }
}
