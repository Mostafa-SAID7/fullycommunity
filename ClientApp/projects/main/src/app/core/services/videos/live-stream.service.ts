import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PagedResult } from '../../types/common.types';
import {
  LiveStream,
  LiveStreamListItem,
  LiveStreamChat,
  LiveStreamGift,
  GiftType,
  LiveStreamFilter,
  CreateLiveStreamRequest,
  UpdateLiveStreamRequest,
  StartLiveStreamResponse,
  SendChatMessageRequest,
  SendGiftRequest
} from '../../interfaces/videos';

@Injectable({
  providedIn: 'root'
})
export class LiveStreamService {
  private readonly apiUrl = `${environment.apiUrl}/live-streams`;

  constructor(private http: HttpClient) {}

  /**
   * Get live stream by ID
   */
  getById(id: string): Observable<LiveStream> {
    return this.http.get<LiveStream>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get all live streams
   */
  getLiveStreams(filter: LiveStreamFilter): Observable<PagedResult<LiveStreamListItem>> {
    let params = new HttpParams();
    
    if (filter.keywords) params = params.set('keywords', filter.keywords);
    if (filter.status !== undefined) params = params.set('status', filter.status.toString());
    if (filter.categoryId) params = params.set('categoryId', filter.categoryId);
    if (filter.sortBy) params = params.set('sortBy', filter.sortBy);
    if (filter.sortDescending !== undefined) params = params.set('sortDescending', filter.sortDescending.toString());
    if (filter.page) params = params.set('page', filter.page.toString());
    if (filter.pageSize) params = params.set('pageSize', filter.pageSize.toString());
    
    return this.http.get<PagedResult<LiveStreamListItem>>(this.apiUrl, { params });
  }

  /**
   * Get live streams currently broadcasting
   */
  getLiveNow(limit: number = 20): Observable<LiveStreamListItem[]> {
    return this.http.get<LiveStreamListItem[]>(`${this.apiUrl}/live-now`, {
      params: { limit: limit.toString() }
    });
  }

  /**
   * Get channel live streams
   */
  getChannelStreams(channelId: string, page: number = 1, pageSize: number = 20): Observable<PagedResult<LiveStreamListItem>> {
    return this.http.get<PagedResult<LiveStreamListItem>>(`${this.apiUrl}/channel/${channelId}`, {
      params: {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    });
  }

  /**
   * Create live stream
   */
  create(channelId: string, request: CreateLiveStreamRequest): Observable<LiveStream> {
    return this.http.post<LiveStream>(`${this.apiUrl}`, {
      channelId,
      ...request
    });
  }

  /**
   * Update live stream
   */
  update(id: string, request: UpdateLiveStreamRequest): Observable<LiveStream> {
    const formData = new FormData();
    
    if (request.title) formData.append('title', request.title);
    if (request.description) formData.append('description', request.description);
    if (request.thumbnailFile) formData.append('thumbnailFile', request.thumbnailFile);
    if (request.allowChat !== undefined) formData.append('allowChat', request.allowChat.toString());
    if (request.slowModeEnabled !== undefined) formData.append('slowModeEnabled', request.slowModeEnabled.toString());
    if (request.slowModeSeconds) formData.append('slowModeSeconds', request.slowModeSeconds.toString());
    if (request.subscribersOnlyChat !== undefined) formData.append('subscribersOnlyChat', request.subscribersOnlyChat.toString());
    if (request.allowGifts !== undefined) formData.append('allowGifts', request.allowGifts.toString());
    
    return this.http.put<LiveStream>(`${this.apiUrl}/${id}`, formData);
  }

  /**
   * Start live stream
   */
  start(id: string): Observable<StartLiveStreamResponse> {
    return this.http.post<StartLiveStreamResponse>(`${this.apiUrl}/${id}/start`, {});
  }

  /**
   * Pause live stream
   */
  pause(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/pause`, {});
  }

  /**
   * Resume live stream
   */
  resume(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/resume`, {});
  }

  /**
   * End live stream
   */
  end(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/end`, {});
  }

  /**
   * Delete live stream
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // ==================== Chat ====================

  /**
   * Get chat messages
   */
  getChatMessages(liveStreamId: string, page: number = 1, pageSize: number = 50): Observable<PagedResult<LiveStreamChat>> {
    return this.http.get<PagedResult<LiveStreamChat>>(`${this.apiUrl}/${liveStreamId}/chat`, {
      params: {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    });
  }

  /**
   * Send chat message
   */
  sendChatMessage(liveStreamId: string, request: SendChatMessageRequest): Observable<LiveStreamChat> {
    return this.http.post<LiveStreamChat>(`${this.apiUrl}/${liveStreamId}/chat`, request);
  }

  /**
   * Delete chat message
   */
  deleteChatMessage(liveStreamId: string, messageId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${liveStreamId}/chat/${messageId}`);
  }

  /**
   * Pin chat message
   */
  pinChatMessage(liveStreamId: string, messageId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${liveStreamId}/chat/${messageId}/pin`, {});
  }

  /**
   * Unpin chat message
   */
  unpinChatMessage(liveStreamId: string, messageId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${liveStreamId}/chat/${messageId}/pin`);
  }

  // ==================== Gifts ====================

  /**
   * Get gift types
   */
  getGiftTypes(): Observable<GiftType[]> {
    return this.http.get<GiftType[]>(`${this.apiUrl}/gift-types`);
  }

  /**
   * Send gift
   */
  sendGift(liveStreamId: string, request: SendGiftRequest): Observable<LiveStreamGift> {
    return this.http.post<LiveStreamGift>(`${this.apiUrl}/${liveStreamId}/gifts`, request);
  }

  /**
   * Get gifts sent in stream
   */
  getGifts(liveStreamId: string, page: number = 1, pageSize: number = 20): Observable<PagedResult<LiveStreamGift>> {
    return this.http.get<PagedResult<LiveStreamGift>>(`${this.apiUrl}/${liveStreamId}/gifts`, {
      params: {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    });
  }

  // ==================== Engagement ====================

  /**
   * Like live stream
   */
  like(liveStreamId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${liveStreamId}/like`, {});
  }

  /**
   * Unlike live stream
   */
  unlike(liveStreamId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${liveStreamId}/like`);
  }

  /**
   * Join live stream (increment viewer count)
   */
  join(liveStreamId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${liveStreamId}/join`, {});
  }

  /**
   * Leave live stream (decrement viewer count)
   */
  leave(liveStreamId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${liveStreamId}/leave`, {});
  }
}
