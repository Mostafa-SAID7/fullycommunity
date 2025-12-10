import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  Story,
  StoryGroup,
  StoryView,
  StoryReply,
  CreateStoryRequest
} from '../../interfaces/home/stories.interface';

@Injectable({
  providedIn: 'root'
})
export class StoriesService {
  private readonly apiUrl = `${environment.apiUrl}/stories`;

  constructor(private http: HttpClient) {}

  /**
   * Get story groups (following users)
   */
  getStoryGroups(): Observable<StoryGroup[]> {
    return this.http.get<StoryGroup[]>(`${this.apiUrl}/groups`);
  }

  /**
   * Get user stories
   */
  getUserStories(userId: string): Observable<Story[]> {
    return this.http.get<Story[]>(`${this.apiUrl}/user/${userId}`);
  }

  /**
   * Get my stories
   */
  getMyStories(): Observable<Story[]> {
    return this.http.get<Story[]>(`${this.apiUrl}/my-stories`);
  }

  /**
   * Get story by ID
   */
  getStory(storyId: string): Observable<Story> {
    return this.http.get<Story>(`${this.apiUrl}/${storyId}`);
  }

  /**
   * Create story
   */
  createStory(request: CreateStoryRequest): Observable<Story> {
    return this.http.post<Story>(this.apiUrl, request);
  }

  /**
   * Delete story
   */
  deleteStory(storyId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${storyId}`);
  }

  /**
   * View story
   */
  viewStory(storyId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${storyId}/view`, {});
  }

  /**
   * Like story
   */
  likeStory(storyId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${storyId}/like`, {});
  }

  /**
   * Unlike story
   */
  unlikeStory(storyId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${storyId}/like`);
  }

  /**
   * Get story views
   */
  getStoryViews(storyId: string): Observable<StoryView[]> {
    return this.http.get<StoryView[]>(`${this.apiUrl}/${storyId}/views`);
  }

  /**
   * Reply to story
   */
  replyToStory(storyId: string, message: string): Observable<StoryReply> {
    return this.http.post<StoryReply>(`${this.apiUrl}/${storyId}/reply`, { message });
  }

  /**
   * Get story replies
   */
  getStoryReplies(storyId: string): Observable<StoryReply[]> {
    return this.http.get<StoryReply[]>(`${this.apiUrl}/${storyId}/replies`);
  }
}
