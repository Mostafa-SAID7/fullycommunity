import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Story {
  id: string;
  userId: string;
  user: StoryUser;
  pageId?: string;
  page?: StoryPage;
  mediaUrl: string;
  thumbnailUrl?: string;
  type: StoryType;
  caption?: string;
  backgroundColor?: string;
  textColor?: string;
  createdAt: string;
  expiresAt: string;
  isActive: boolean;
  isArchived: boolean;
  visibility: StoryVisibility;
  viewCount: number;
  likeCount: number;
  replyCount: number;
  isViewed: boolean;
  isLiked: boolean;
  canView: boolean;
}

export interface StoryUser {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  isVerified: boolean;
}

export interface StoryPage {
  id: string;
  name: string;
  username: string;
  profileImageUrl?: string;
  isVerified: boolean;
  category: string;
}

export interface StoryView {
  id: string;
  userId: string;
  user: StoryUser;
  viewedAt: string;
}

export interface StoryReply {
  id: string;
  userId: string;
  user: StoryUser;
  content: string;
  mediaUrl?: string;
  type: StoryReplyType;
  createdAt: string;
}

export enum StoryType {
  Image = 'Image',
  Video = 'Video',
  Text = 'Text',
  Boomerang = 'Boomerang',
  Live = 'Live'
}

export enum StoryVisibility {
  Public = 'Public',
  Friends = 'Friends',
  CloseFriends = 'CloseFriends',
  Private = 'Private'
}

export enum StoryReplyType {
  Text = 'Text',
  Image = 'Image',
  Video = 'Video',
  Emoji = 'Emoji'
}

export interface StoryFilter {
  userId?: string;
  pageId?: string;
  includeExpired?: boolean;
  visibility?: StoryVisibility;
  type?: StoryType;
}

export interface CreateStoryRequest {
  pageId?: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  type: StoryType;
  caption?: string;
  backgroundColor?: string;
  textColor?: string;
  visibility: StoryVisibility;
  viewerIds?: string[];
}

export interface CreateStoryReplyRequest {
  content: string;
  mediaUrl?: string;
  type: StoryReplyType;
}

@Injectable({ providedIn: 'root' })
export class StoriesService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/stories`;

  stories = signal<Story[]>([]);
  loading = signal(false);

  getStories(filter: StoryFilter = {}): Observable<Story[]> {
    let params = new HttpParams();
    if (filter.userId) params = params.set('userId', filter.userId);
    if (filter.pageId) params = params.set('pageId', filter.pageId);
    if (filter.includeExpired !== undefined) params = params.set('includeExpired', filter.includeExpired);
    if (filter.visibility) params = params.set('visibility', filter.visibility);
    if (filter.type) params = params.set('type', filter.type);

    return this.http.get<Story[]>(this.apiUrl, { params });
  }

  getStory(id: string): Observable<Story> {
    return this.http.get<Story>(`${this.apiUrl}/${id}`);
  }

  createStory(request: CreateStoryRequest): Observable<Story> {
    return this.http.post<Story>(this.apiUrl, request);
  }

  deleteStory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  viewStory(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/view`, {});
  }

  likeStory(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/like`, {});
  }

  unlikeStory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/like`);
  }

  getStoryViews(id: string): Observable<StoryView[]> {
    return this.http.get<StoryView[]>(`${this.apiUrl}/${id}/views`);
  }

  getStoryReplies(id: string): Observable<StoryReply[]> {
    return this.http.get<StoryReply[]>(`${this.apiUrl}/${id}/replies`);
  }

  replyToStory(storyId: string, request: CreateStoryReplyRequest): Observable<StoryReply> {
    return this.http.post<StoryReply>(`${this.apiUrl}/${storyId}/replies`, request);
  }

  getMyStories(): Observable<Story[]> {
    return this.http.get<Story[]>(`${this.apiUrl}/my-stories`);
  }

  getFollowingStories(): Observable<Story[]> {
    return this.http.get<Story[]>(`${this.apiUrl}/following`);
  }


}