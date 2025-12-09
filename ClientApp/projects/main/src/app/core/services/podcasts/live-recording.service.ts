import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PagedResult } from '../../types/common.types';
import {
  LiveRecording,
  LiveRecordingListItem,
  StreamCredentials,
  LiveChatMessage,
  LiveTip,
  ScheduleLiveRecordingRequest,
  UpdateLiveRecordingRequest,
  SendTipRequest
} from '../../interfaces/podcasts';

@Injectable({
  providedIn: 'root'
})
export class LiveRecordingService {
  private readonly apiUrl = `${environment.apiUrl}/podcasts`;

  constructor(private http: HttpClient) {}

  /**
   * Get live recording by ID
   */
  getById(recordingId: string): Observable<LiveRecording> {
    return this.http.get<LiveRecording>(`${this.apiUrl}/live/${recordingId}`);
  }

  /**
   * Get live recordings for podcast
   */
  getByPodcast(podcastId: string, page: number = 1, pageSize: number = 20): Observable<PagedResult<LiveRecordingListItem>> {
    return this.http.get<PagedResult<LiveRecordingListItem>>(`${this.apiUrl}/${podcastId}/live`, {
      params: { page: page.toString(), pageSize: pageSize.toString() }
    });
  }

  /**
   * Get currently live recordings
   */
  getCurrentlyLive(pageSize: number = 20): Observable<LiveRecordingListItem[]> {
    return this.http.get<LiveRecordingListItem[]>(`${this.apiUrl}/live/current`, {
      params: { pageSize: pageSize.toString() }
    });
  }

  /**
   * Get upcoming live recordings
   */
  getUpcoming(pageSize: number = 20): Observable<LiveRecordingListItem[]> {
    return this.http.get<LiveRecordingListItem[]>(`${this.apiUrl}/live/upcoming`, {
      params: { pageSize: pageSize.toString() }
    });
  }

  /**
   * Schedule live recording
   */
  schedule(podcastId: string, request: ScheduleLiveRecordingRequest): Observable<LiveRecording> {
    return this.http.post<LiveRecording>(`${this.apiUrl}/${podcastId}/live`, request);
  }

  /**
   * Update live recording
   */
  update(recordingId: string, request: UpdateLiveRecordingRequest): Observable<LiveRecording> {
    return this.http.put<LiveRecording>(`${this.apiUrl}/live/${recordingId}`, request);
  }

  /**
   * Cancel live recording
   */
  cancel(recordingId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/live/${recordingId}/cancel`, {});
  }

  /**
   * Start live recording
   */
  start(recordingId: string): Observable<StreamCredentials> {
    return this.http.post<StreamCredentials>(`${this.apiUrl}/live/${recordingId}/start`, {});
  }

  /**
   * End live recording
   */
  end(recordingId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/live/${recordingId}/end`, {});
  }

  /**
   * Get stream credentials
   */
  getStreamCredentials(recordingId: string): Observable<StreamCredentials> {
    return this.http.get<StreamCredentials>(`${this.apiUrl}/live/${recordingId}/credentials`);
  }

  // ========== Chat ==========

  /**
   * Get chat messages
   */
  getChatMessages(recordingId: string, page: number = 1, pageSize: number = 50): Observable<PagedResult<LiveChatMessage>> {
    return this.http.get<PagedResult<LiveChatMessage>>(`${this.apiUrl}/live/${recordingId}/chat`, {
      params: { page: page.toString(), pageSize: pageSize.toString() }
    });
  }

  /**
   * Send chat message
   */
  sendChatMessage(recordingId: string, message: string, replyToId?: string): Observable<LiveChatMessage> {
    return this.http.post<LiveChatMessage>(`${this.apiUrl}/live/${recordingId}/chat`, { message, replyToId });
  }

  /**
   * Delete chat message
   */
  deleteChatMessage(recordingId: string, messageId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/live/${recordingId}/chat/${messageId}`);
  }

  /**
   * Pin chat message
   */
  pinChatMessage(recordingId: string, messageId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/live/${recordingId}/chat/${messageId}/pin`, {});
  }

  // ========== Tips ==========

  /**
   * Get tips
   */
  getTips(recordingId: string, page: number = 1, pageSize: number = 20): Observable<PagedResult<LiveTip>> {
    return this.http.get<PagedResult<LiveTip>>(`${this.apiUrl}/live/${recordingId}/tips`, {
      params: { page: page.toString(), pageSize: pageSize.toString() }
    });
  }

  /**
   * Send tip
   */
  sendTip(recordingId: string, request: SendTipRequest): Observable<LiveTip> {
    return this.http.post<LiveTip>(`${this.apiUrl}/live/${recordingId}/tips`, request);
  }
}
