import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { 
  Channel, ChannelStats, ChannelSearchRequest, CreateChannelRequest, 
  UpdateChannelRequest, Video, PagedResult, ChannelSummary 
} from '../media/video.service';

@Injectable({ providedIn: 'root' })
export class ChannelService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/api/videos/channels`;

  getChannel(id: string): Observable<Channel> {
    return this.http.get<Channel>(`${this.baseUrl}/${id}`);
  }

  getChannelByHandle(handle: string): Observable<Channel> {
    return this.http.get<Channel>(`${this.baseUrl}/@${handle}`);
  }

  searchChannels(request: ChannelSearchRequest): Observable<PagedResult<Channel>> {
    let params = new HttpParams();
    Object.keys(request).forEach(key => {
      const val = (request as any)[key];
      if (val !== undefined && val !== null) params = params.set(key, val.toString());
    });
    return this.http.get<PagedResult<Channel>>(this.baseUrl, { params });
  }

  getTrendingChannels(count = 10): Observable<Channel[]> {
    return this.http.get<Channel[]>(`${this.baseUrl}/trending`, { params: { count } });
  }

  getSuggestedChannels(count = 10): Observable<Channel[]> {
    return this.http.get<Channel[]>(`${this.baseUrl}/suggested`, { params: { count } });
  }

  getChannelVideos(channelId: string, page = 1, pageSize = 20): Observable<PagedResult<Video>> {
    return this.http.get<PagedResult<Video>>(`${this.baseUrl}/${channelId}/videos`, { params: { page, pageSize } });
  }

  getMyChannel(): Observable<Channel> {
    return this.http.get<Channel>(`${this.baseUrl}/me`);
  }

  getMyStats(): Observable<ChannelStats> {
    return this.http.get<ChannelStats>(`${this.baseUrl}/me/stats`);
  }

  createChannel(request: CreateChannelRequest): Observable<Channel> {
    return this.http.post<Channel>(this.baseUrl, request);
  }

  updateChannel(request: UpdateChannelRequest): Observable<Channel> {
    return this.http.put<Channel>(`${this.baseUrl}/me`, request);
  }

  subscribe(channelId: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${channelId}/subscribe`, {});
  }

  unsubscribe(channelId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${channelId}/subscribe`);
  }

  isSubscribed(channelId: string): Observable<{ isSubscribed: boolean }> {
    return this.http.get<{ isSubscribed: boolean }>(`${this.baseUrl}/${channelId}/subscribed`);
  }

  getMySubscriptions(page = 1, pageSize = 20): Observable<PagedResult<ChannelSummary>> {
    return this.http.get<PagedResult<ChannelSummary>>(`${this.baseUrl}/me/subscriptions`, { params: { page, pageSize } });
  }

  getSubscribers(channelId: string, page = 1, pageSize = 20): Observable<PagedResult<ChannelSummary>> {
    return this.http.get<PagedResult<ChannelSummary>>(`${this.baseUrl}/${channelId}/subscribers`, { params: { page, pageSize } });
  }
}
