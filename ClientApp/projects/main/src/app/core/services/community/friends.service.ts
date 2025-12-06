import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Friend {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  userType: string;
  friendsSince: string;
  mutualFriends: number;
}

export interface FriendRequest {
  requestId: string;
  userId: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  userType: string;
  requestedAt: string;
  mutualFriends: number;
}

export interface FriendSuggestion {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  userType: string;
  mutualFriends: number;
  reason: string;
}

@Injectable({ providedIn: 'root' })
export class FriendsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/community/friends`;

  getFriends(search?: string): Observable<Friend[]> {
    let params = new HttpParams();
    if (search) {
      params = params.set('search', search);
    }
    return this.http.get<Friend[]>(this.apiUrl, { params });
  }

  getFriendRequests(): Observable<FriendRequest[]> {
    return this.http.get<FriendRequest[]>(`${this.apiUrl}/requests`);
  }

  getFriendSuggestions(): Observable<FriendSuggestion[]> {
    return this.http.get<FriendSuggestion[]>(`${this.apiUrl}/suggestions`);
  }

  sendFriendRequest(userId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/request/${userId}`, {});
  }

  acceptFriendRequest(requestId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/accept/${requestId}`, {});
  }

  declineFriendRequest(requestId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/decline/${requestId}`, {});
  }

  removeFriend(friendId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${friendId}`);
  }

  blockUser(userId: string, reason?: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/block/${userId}`, { reason });
  }

  unblockUser(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/unblock/${userId}`);
  }


}