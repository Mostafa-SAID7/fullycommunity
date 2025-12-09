import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { PagedResult } from '../../../types';
import {
  Friend,
  FriendRequest,
  Follower,
  Following,
  UserSocialStats,
  FriendFilter,
  BlockUserRequest
} from '../../../interfaces/community/friends';

@Injectable({ providedIn: 'root' })
export class FriendsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/community/friends`;

  // ============================================================================
  // FRIEND OPERATIONS
  // ============================================================================

  getFriends(filter: FriendFilter = {}, page = 1, pageSize = 20): Observable<PagedResult<Friend>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (filter.userId) params = params.set('userId', filter.userId);
    if (filter.searchTerm) params = params.set('searchTerm', filter.searchTerm);
    if (filter.sortBy) params = params.set('sortBy', filter.sortBy);
    if (filter.status !== undefined) params = params.set('status', filter.status.toString());
    if (filter.isOnline !== undefined) params = params.set('isOnline', filter.isOnline.toString());
    if (filter.mutualFriendsOnly) params = params.set('mutualFriendsOnly', 'true');
    if (filter.hasCommonInterests) params = params.set('hasCommonInterests', 'true');
    if (filter.location) params = params.set('location', filter.location);
    if (filter.joinedAfter) params = params.set('joinedAfter', filter.joinedAfter);
    if (filter.joinedBefore) params = params.set('joinedBefore', filter.joinedBefore);

    const url = filter.userId ? `${this.apiUrl}/user/${filter.userId}` : this.apiUrl;
    return this.http.get<PagedResult<Friend>>(url, { params });
  }

  searchFriends(searchTerm: string, page = 1, pageSize = 20): Observable<PagedResult<Friend>> {
    return this.getFriends({ searchTerm }, page, pageSize);
  }

  removeFriend(friendId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${friendId}`);
  }

  // ============================================================================
  // FRIEND REQUEST OPERATIONS
  // ============================================================================

  getFriendRequests(page = 1, pageSize = 20): Observable<PagedResult<FriendRequest>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<PagedResult<FriendRequest>>(`${this.apiUrl}/requests`, { params });
  }

  getSentRequests(page = 1, pageSize = 20): Observable<PagedResult<FriendRequest>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<PagedResult<FriendRequest>>(`${this.apiUrl}/requests/sent`, { params });
  }

  sendFriendRequest(userId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/request/${userId}`, {});
  }

  acceptFriendRequest(requestId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/accept/${requestId}`, {});
  }

  declineFriendRequest(requestId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/decline/${requestId}`, {});
  }

  cancelFriendRequest(requestId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/request/${requestId}`);
  }

  // ============================================================================
  // FOLLOWER/FOLLOWING OPERATIONS
  // ============================================================================

  getFollowers(userId?: string, page = 1, pageSize = 20): Observable<PagedResult<Follower>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    const url = userId ? `${this.apiUrl}/followers/${userId}` : `${this.apiUrl}/followers`;
    return this.http.get<PagedResult<Follower>>(url, { params });
  }

  getFollowing(userId?: string, page = 1, pageSize = 20): Observable<PagedResult<Following>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    const url = userId ? `${this.apiUrl}/following/${userId}` : `${this.apiUrl}/following`;
    return this.http.get<PagedResult<Following>>(url, { params });
  }

  followUser(userId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/follow/${userId}`, {});
  }

  unfollowUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/follow/${userId}`);
  }

  // ============================================================================
  // STATS & SUGGESTIONS
  // ============================================================================

  getSocialStats(userId?: string): Observable<UserSocialStats> {
    const url = userId ? `${this.apiUrl}/stats/${userId}` : `${this.apiUrl}/stats`;
    return this.http.get<UserSocialStats>(url);
  }

  getSuggestions(count = 10): Observable<Friend[]> {
    return this.http.get<Friend[]>(`${this.apiUrl}/suggestions`, {
      params: { count: count.toString() }
    });
  }

  // ============================================================================
  // BLOCK OPERATIONS
  // ============================================================================

  blockUser(userId: string, request?: BlockUserRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/block/${userId}`, request || {});
  }

  unblockUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/block/${userId}`);
  }

  getBlockedUsers(page = 1, pageSize = 20): Observable<PagedResult<Friend>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<PagedResult<Friend>>(`${this.apiUrl}/blocked`, { params });
  }
}
