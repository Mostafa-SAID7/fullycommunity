import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { environment } from '../../../../environments/environment';

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
  category: PageCategory;
}

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

export interface StoryView {
  id: string;
  userId: string;
  user: StoryUser;
  viewedAt: string;
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

export enum PageCategory {
  CarDealer = 'CarDealer',
  Garage = 'Garage',
  PartsStore = 'PartsStore',
  Insurance = 'Insurance',
  Influencer = 'Influencer',
  Brand = 'Brand',
  Community = 'Community'
}

@Injectable({ providedIn: 'root' })
export class StoriesService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/stories`;

  stories = signal<Story[]>([]);
  loading = signal(false);

  getStories(userId?: string, pageId?: string, includeExpired = false): Observable<Story[]> {
    let params = new HttpParams();
    if (userId) params = params.set('userId', userId);
    if (pageId) params = params.set('pageId', pageId);
    if (includeExpired) params = params.set('includeExpired', includeExpired.toString());

    return this.http.get<Story[]>(this.apiUrl, { params }).pipe(
      catchError(() => of(this.getMockStories()))
    );
  }

  getStory(id: string): Observable<Story> {
    return this.http.get<Story>(`${this.apiUrl}/${id}`);
  }

  createStory(request: CreateStoryRequest): Observable<Story> {
    return this.http.post<Story>(this.apiUrl, request);
  }

  viewStory(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(`${this.apiUrl}/${id}/view`, {});
  }

  likeStory(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(`${this.apiUrl}/${id}/like`, {});
  }

  unlikeStory(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${id}/like`);
  }

  getStoryViews(id: string): Observable<StoryView[]> {
    return this.http.get<StoryView[]>(`${this.apiUrl}/${id}/views`);
  }

  deleteStory(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${id}`);
  }

  // Load stories with state management
  loadStories(userId?: string, pageId?: string, reset = false) {
    if (this.loading()) return;
    
    this.loading.set(true);

    this.getStories(userId, pageId).subscribe({
      next: (stories) => {
        this.stories.set(stories);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading stories:', error);
        this.stories.set(this.getMockStories());
        this.loading.set(false);
      }
    });
  }

  // Mock data for demo when API is unavailable
  private getMockStories(): Story[] {
    return [
      {
        id: '1',
        userId: 'user1',
        user: {
          id: 'user1',
          firstName: 'John',
          lastName: 'Doe',
          avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
          isVerified: false
        },
        mediaUrl: 'https://images.unsplash.com/photo-1549927681-0b673b922a7b?w=400&h=600&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1549927681-0b673b922a7b?w=200&h=300&fit=crop',
        type: StoryType.Image,
        caption: 'Just finished detailing my ride! ✨',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        expiresAt: new Date(Date.now() + 22 * 60 * 60 * 1000).toISOString(),
        isActive: true,
        isArchived: false,
        visibility: StoryVisibility.Public,
        viewCount: 45,
        likeCount: 12,
        replyCount: 3,
        isViewed: false,
        isLiked: false,
        canView: true
      },
      {
        id: '2',
        userId: 'user2',
        user: {
          id: 'user2',
          firstName: 'Alice',
          lastName: 'Smith',
          avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
          isVerified: true
        },
        pageId: 'page1',
        page: {
          id: 'page1',
          name: 'AutoMax Dealership',
          username: 'automax_official',
          profileImageUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop',
          isVerified: true,
          category: PageCategory.CarDealer
        },
        mediaUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=600&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=200&h=300&fit=crop',
        type: StoryType.Image,
        caption: 'New 2024 models just arrived! Come check them out 🚗',
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        expiresAt: new Date(Date.now() + 23 * 60 * 60 * 1000).toISOString(),
        isActive: true,
        isArchived: false,
        visibility: StoryVisibility.Public,
        viewCount: 128,
        likeCount: 34,
        replyCount: 8,
        isViewed: false,
        isLiked: false,
        canView: true
      },
      {
        id: '3',
        userId: 'user3',
        user: {
          id: 'user3',
          firstName: 'Bob',
          lastName: 'Wilson',
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
          isVerified: false
        },
        mediaUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=600&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=200&h=300&fit=crop',
        type: StoryType.Image,
        caption: 'Track day was amazing! 🏁',
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        expiresAt: new Date(Date.now() + 20 * 60 * 60 * 1000).toISOString(),
        isActive: true,
        isArchived: false,
        visibility: StoryVisibility.Public,
        viewCount: 67,
        likeCount: 23,
        replyCount: 5,
        isViewed: true,
        isLiked: false,
        canView: true
      },
      {
        id: '4',
        userId: 'user4',
        user: {
          id: 'user4',
          firstName: 'Emma',
          lastName: 'Davis',
          avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
          isVerified: false
        },
        mediaUrl: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400&h=600&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=200&h=300&fit=crop',
        type: StoryType.Image,
        caption: 'Sunday drive with the family 🌟',
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        expiresAt: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString(),
        isActive: true,
        isArchived: false,
        visibility: StoryVisibility.Public,
        viewCount: 89,
        likeCount: 31,
        replyCount: 7,
        isViewed: false,
        isLiked: true,
        canView: true
      },
      {
        id: '5',
        userId: 'user5',
        user: {
          id: 'user5',
          firstName: 'Mike',
          lastName: 'Chen',
          avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
          isVerified: false
        },
        mediaUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=300&fit=crop',
        type: StoryType.Image,
        caption: 'Electric future is here! ⚡',
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        expiresAt: new Date(Date.now() + 23.5 * 60 * 60 * 1000).toISOString(),
        isActive: true,
        isArchived: false,
        visibility: StoryVisibility.Public,
        viewCount: 156,
        likeCount: 42,
        replyCount: 12,
        isViewed: false,
        isLiked: false,
        canView: true
      }
    ];
  }
}