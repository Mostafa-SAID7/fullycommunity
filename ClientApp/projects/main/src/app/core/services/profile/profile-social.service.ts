import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PagedResult } from '../../types/common.types';
import {
  ProfileSocial,
  Follower,
  Following,
  FriendRequest,
  SocialLink,
  AddSocialLinkRequest
} from '../../interfaces/profile';

@Injectable({
  providedIn: 'root'
})
export class ProfileSocialService {
  private readonly apiUrl = `${environment.apiUrl}/profile/social`;

  constructor(private http: HttpClient) {}

  /**
   * Get profile social info
   */
  getSocialInfo(userId: string): Observable<ProfileSocial> {
    return this.http.get<ProfileSocial>(`${this.apiUrl}/${userId}`);
  }

  /**
   * Get followers
   */
  getFollowers(userId: string, page: number = 1, pageSize: number = 20): Observable<PagedResult<Follower>> {
    return this.http.get<PagedResult<Follower>>(`${this.apiUrl}/${userId}/followers`, {
      params: {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    });
  }

  /**
   * Get following
   */
  getFollowing(userId: string, page: number = 1, pageSize: number = 20): Observable<PagedResult<Following>> {
    return this.http.get<PagedResult<Following>>(`${this.apiUrl}/${userId}/following`, {
      params: {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    });
  }

  /**
   * Follow user
   */
  followUser(userId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/follow/${userId}`, {});
  }

  /**
   * Unfollow user
   */
  unfollowUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/follow/${userId}`);
  }

  /**
   * Get friend requests
   */
  getFriendRequests(): Observable<FriendRequest[]> {
    return this.http.get<FriendRequest[]>(`${this.apiUrl}/friend-requests`);
  }

  /**
   * Send friend request
   */
  sendFriendRequest(userId: string, message?: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/friend-requests`, { userId, message });
  }

  /**
   * Accept friend request
   */
  acceptFriendRequest(requestId: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/friend-requests/${requestId}/accept`, {});
  }

  /**
   * Reject friend request
   */
  rejectFriendRequest(requestId: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/friend-requests/${requestId}/reject`, {});
  }

  /**
   * Cancel friend request
   */
  cancelFriendRequest(requestId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/friend-requests/${requestId}`);
  }

  /**
   * Remove friend
   */
  removeFriend(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/friends/${userId}`);
  }

  /**
   * Get social links
   */
  getSocialLinks(userId: string): Observable<SocialLink[]> {
    return this.http.get<SocialLink[]>(`${this.apiUrl}/${userId}/links`);
  }

  /**
   * Add social link
   */
  addSocialLink(request: AddSocialLinkRequest): Observable<SocialLink> {
    return this.http.post<SocialLink>(`${this.apiUrl}/links`, request);
  }

  /**
   * Update social link
   */
  updateSocialLink(linkId: string, request: Partial<AddSocialLinkRequest>): Observable<SocialLink> {
    return this.http.put<SocialLink>(`${this.apiUrl}/links/${linkId}`, request);
  }

  /**
   * Delete social link
   */
  deleteSocialLink(linkId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/links/${linkId}`);
  }

  /**
   * Reorder social links
   */
  reorderSocialLinks(linkIds: string[]): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/links/reorder`, { linkIds });
  }
}
