import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PagedResult } from '../../types/common.types';
import {
  Channel,
  ChannelListItem,
  ChannelSubscription,
  CreateChannelRequest,
  UpdateChannelRequest,
  SubscribeChannelRequest,
  UnsubscribeChannelRequest,
  UpdateSubscriptionRequest
} from '../../interfaces/videos';

@Injectable({
  providedIn: 'root'
})
export class ChannelsService {
  private readonly apiUrl = `${environment.apiUrl}/channels`;

  constructor(private http: HttpClient) {}

  /**
   * Get channel by ID
   */
  getById(id: string): Observable<Channel> {
    return this.http.get<Channel>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get channel by handle
   */
  getByHandle(handle: string): Observable<Channel> {
    return this.http.get<Channel>(`${this.apiUrl}/handle/${handle}`);
  }

  /**
   * Get all channels
   */
  getChannels(searchTerm?: string, page: number = 1, pageSize: number = 20): Observable<PagedResult<ChannelListItem>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    
    if (searchTerm) {
      params = params.set('searchTerm', searchTerm);
    }
    
    return this.http.get<PagedResult<ChannelListItem>>(this.apiUrl, { params });
  }

  /**
   * Get trending channels
   */
  getTrending(limit: number = 20): Observable<ChannelListItem[]> {
    return this.http.get<ChannelListItem[]>(`${this.apiUrl}/trending`, {
      params: { limit: limit.toString() }
    });
  }

  /**
   * Get recommended channels
   */
  getRecommended(limit: number = 20): Observable<ChannelListItem[]> {
    return this.http.get<ChannelListItem[]>(`${this.apiUrl}/recommended`, {
      params: { limit: limit.toString() }
    });
  }

  /**
   * Create channel
   */
  create(request: CreateChannelRequest): Observable<Channel> {
    const formData = new FormData();
    
    formData.append('handle', request.handle);
    formData.append('displayName', request.displayName);
    if (request.bio) formData.append('bio', request.bio);
    if (request.avatarFile) formData.append('avatarFile', request.avatarFile);
    if (request.bannerFile) formData.append('bannerFile', request.bannerFile);
    if (request.websiteUrl) formData.append('websiteUrl', request.websiteUrl);
    if (request.contentCategories?.length) formData.append('contentCategories', JSON.stringify(request.contentCategories));
    if (request.country) formData.append('country', request.country);
    if (request.city) formData.append('city', request.city);
    
    return this.http.post<Channel>(this.apiUrl, formData);
  }

  /**
   * Update channel
   */
  update(id: string, request: UpdateChannelRequest): Observable<Channel> {
    const formData = new FormData();
    
    if (request.displayName) formData.append('displayName', request.displayName);
    if (request.bio) formData.append('bio', request.bio);
    if (request.avatarFile) formData.append('avatarFile', request.avatarFile);
    if (request.bannerFile) formData.append('bannerFile', request.bannerFile);
    if (request.websiteUrl) formData.append('websiteUrl', request.websiteUrl);
    if (request.allowComments !== undefined) formData.append('allowComments', request.allowComments.toString());
    if (request.showSubscriberCount !== undefined) formData.append('showSubscriberCount', request.showSubscriberCount.toString());
    if (request.allowDuets !== undefined) formData.append('allowDuets', request.allowDuets.toString());
    if (request.allowStitches !== undefined) formData.append('allowStitches', request.allowStitches.toString());
    if (request.allowDownloads !== undefined) formData.append('allowDownloads', request.allowDownloads.toString());
    if (request.instagramUrl) formData.append('instagramUrl', request.instagramUrl);
    if (request.twitterUrl) formData.append('twitterUrl', request.twitterUrl);
    if (request.tiktokUrl) formData.append('tiktokUrl', request.tiktokUrl);
    if (request.youtubeUrl) formData.append('youtubeUrl', request.youtubeUrl);
    if (request.contentCategories?.length) formData.append('contentCategories', JSON.stringify(request.contentCategories));
    if (request.country) formData.append('country', request.country);
    if (request.city) formData.append('city', request.city);
    
    return this.http.put<Channel>(`${this.apiUrl}/${id}`, formData);
  }

  /**
   * Delete channel
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Subscribe to channel
   */
  subscribe(request: SubscribeChannelRequest): Observable<ChannelSubscription> {
    return this.http.post<ChannelSubscription>(`${this.apiUrl}/${request.channelId}/subscribe`, {
      notificationsEnabled: request.notificationsEnabled
    });
  }

  /**
   * Unsubscribe from channel
   */
  unsubscribe(request: UnsubscribeChannelRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${request.channelId}/unsubscribe`, {});
  }

  /**
   * Update subscription
   */
  updateSubscription(channelId: string, request: UpdateSubscriptionRequest): Observable<ChannelSubscription> {
    return this.http.put<ChannelSubscription>(`${this.apiUrl}/${channelId}/subscription`, request);
  }

  /**
   * Get user subscriptions
   */
  getSubscriptions(page: number = 1, pageSize: number = 20): Observable<PagedResult<ChannelListItem>> {
    return this.http.get<PagedResult<ChannelListItem>>(`${this.apiUrl}/subscriptions`, {
      params: {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    });
  }

  /**
   * Get channel subscribers
   */
  getSubscribers(channelId: string, page: number = 1, pageSize: number = 20): Observable<PagedResult<any>> {
    return this.http.get<PagedResult<any>>(`${this.apiUrl}/${channelId}/subscribers`, {
      params: {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    });
  }
}
