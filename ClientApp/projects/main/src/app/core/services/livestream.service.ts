import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { 
  LiveStream, ChatMessage, GiftType, CreateLiveStreamRequest, 
  SendChatMessageRequest, SendGiftRequest, PagedResult 
} from './video.service';

export interface LiveStreamSearchRequest {
  query?: string;
  categoryId?: string;
  status?: 'Scheduled' | 'Live' | 'Ended';
  page?: number;
  pageSize?: number;
}

@Injectable({ providedIn: 'root' })
export class LiveStreamService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/api/videos/live`;

  getLiveStream(id: string): Observable<LiveStream> {
    return this.http.get<LiveStream>(`${this.baseUrl}/${id}`);
  }

  searchLiveStreams(request: LiveStreamSearchRequest): Observable<PagedResult<LiveStream>> {
    let params = new HttpParams();
    Object.keys(request).forEach(key => {
      const val = (request as any)[key];
      if (val !== undefined && val !== null) params = params.set(key, val.toString());
    });
    return this.http.get<PagedResult<LiveStream>>(this.baseUrl, { params });
  }

  getLiveNow(count = 20): Observable<LiveStream[]> {
    return this.http.get<LiveStream[]>(`${this.baseUrl}/now`, { params: { count } });
  }

  getUpcoming(count = 20): Observable<LiveStream[]> {
    return this.http.get<LiveStream[]>(`${this.baseUrl}/upcoming`, { params: { count } });
  }

  createLiveStream(request: CreateLiveStreamRequest): Observable<LiveStream> {
    return this.http.post<LiveStream>(this.baseUrl, request);
  }

  startLiveStream(id: string): Observable<{ streamKey: string; streamUrl: string }> {
    return this.http.post<{ streamKey: string; streamUrl: string }>(`${this.baseUrl}/${id}/start`, {});
  }

  pauseLiveStream(id: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/pause`, {});
  }

  resumeLiveStream(id: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/resume`, {});
  }

  endLiveStream(id: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/end`, {});
  }

  // Chat
  getChatMessages(streamId: string, page = 1, pageSize = 50): Observable<PagedResult<ChatMessage>> {
    return this.http.get<PagedResult<ChatMessage>>(`${this.baseUrl}/${streamId}/chat`, { params: { page, pageSize } });
  }

  sendChatMessage(streamId: string, request: SendChatMessageRequest): Observable<ChatMessage> {
    return this.http.post<ChatMessage>(`${this.baseUrl}/${streamId}/chat`, request);
  }

  // Gifts
  getGiftTypes(): Observable<GiftType[]> {
    return this.http.get<GiftType[]>(`${this.baseUrl}/gifts`);
  }

  sendGift(streamId: string, request: SendGiftRequest): Observable<{ id: string; giftType: GiftType }> {
    return this.http.post<{ id: string; giftType: GiftType }>(`${this.baseUrl}/${streamId}/gifts`, request);
  }

  getRecentGifts(streamId: string, count = 20): Observable<{ userId: string; userName: string; giftType: GiftType; createdAt: string }[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${streamId}/gifts/recent`, { params: { count } });
  }

  // Viewers
  joinStream(streamId: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${streamId}/join`, {});
  }

  leaveStream(streamId: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${streamId}/leave`, {});
  }

  getViewerCount(streamId: string): Observable<{ viewerCount: number }> {
    return this.http.get<{ viewerCount: number }>(`${this.baseUrl}/${streamId}/viewers`);
  }
}
