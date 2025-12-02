import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Post {
  id: string;
  authorId: string;
  author: PostAuthor;
  title: string;
  content: string;
  slug: string;
  type: PostType;
  status: string;
  visibility: string;
  coverImageUrl?: string;
  media: PostMedia[];
  categoryId?: string;
  category?: PostCategory;
  tags: string[];
  groupId?: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  allowComments: boolean;
  isPinned: boolean;
  isFeatured: boolean;
  isLiked?: boolean;
  publishedAt: string;
  createdAt: string;
}

export interface PostAuthor {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  userType: string;
}

export interface PostMedia {
  id: string;
  url: string;
  type: 'image' | 'video';
  thumbnailUrl?: string;
}

export interface PostCategory {
  id: string;
  name: string;
  slug: string;
  icon?: string;
}

export interface PostComment {
  id: string;
  postId: string;
  authorId: string;
  author: PostAuthor;
  content: string;
  likeCount: number;
  isLiked?: boolean;
  parentId?: string;
  replies?: PostComment[];
  createdAt: string;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  type: PostType;
  visibility: string;
  categoryId?: string;
  tags?: string[];
  groupId?: string;
  mediaUrls?: string[];
}

export interface PostFilter {
  type?: PostType;
  categoryId?: string;
  visibility?: string;
  searchTerm?: string;
  tag?: string;
  isFeatured?: boolean;
  sortBy?: string;
}

export type PostType = 'General' | 'Article' | 'Question' | 'Poll' | 'Announcement';

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface TrendingTopic {
  id: string;
  name: string;
  postCount: number;
  category: string;
}

export interface SuggestedUser {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  userType: string;
  mutualFriends: number;
}

@Injectable({ providedIn: 'root' })
export class CommunityService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/community`;

  posts = signal<Post[]>([]);
  loading = signal(false);
  currentPage = signal(1);
  hasMore = signal(true);

  // Posts
  getPosts(filter: PostFilter = {}, page = 1, pageSize = 20): Observable<PagedResult<Post>> {
    let params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize);
    
    if (filter.type) params = params.set('type', filter.type);
    if (filter.categoryId) params = params.set('categoryId', filter.categoryId);
    if (filter.searchTerm) params = params.set('searchTerm', filter.searchTerm);
    if (filter.tag) params = params.set('tag', filter.tag);
    if (filter.sortBy) params = params.set('sortBy', filter.sortBy);

    return this.http.get<PagedResult<Post>>(`${this.apiUrl}/posts`, { params });
  }

  getFeed(page = 1, pageSize = 20): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/posts/feed`, {
      params: { page, pageSize }
    });
  }

  getPost(id: string): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/posts/${id}`);
  }

  createPost(request: CreatePostRequest): Observable<Post> {
    return this.http.post<Post>(`${this.apiUrl}/posts`, request);
  }

  updatePost(id: string, request: Partial<CreatePostRequest>): Observable<Post> {
    return this.http.put<Post>(`${this.apiUrl}/posts/${id}`, request);
  }

  deletePost(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/posts/${id}`);
  }

  // Engagement
  likePost(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/posts/${id}/like`, {});
  }

  unlikePost(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/posts/${id}/like`);
  }

  sharePost(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/posts/${id}/share`, {});
  }

  // Comments
  getComments(postId: string, page = 1): Observable<PagedResult<PostComment>> {
    return this.http.get<PagedResult<PostComment>>(`${this.apiUrl}/posts/${postId}/comments`, {
      params: { page }
    });
  }

  addComment(postId: string, content: string, parentId?: string): Observable<PostComment> {
    return this.http.post<PostComment>(`${this.apiUrl}/posts/${postId}/comments`, { content, parentId });
  }

  deleteComment(commentId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/posts/comments/${commentId}`);
  }

  // Categories
  getCategories(): Observable<PostCategory[]> {
    return this.http.get<PostCategory[]>(`${this.apiUrl}/posts/categories`);
  }

  // Trending & Suggestions
  getTrendingTopics(): Observable<TrendingTopic[]> {
    return this.http.get<TrendingTopic[]>(`${this.apiUrl}/trending`);
  }

  getSuggestedUsers(): Observable<SuggestedUser[]> {
    return this.http.get<SuggestedUser[]>(`${this.apiUrl}/suggestions/users`);
  }

  // Load more posts
  loadPosts(filter: PostFilter = {}, reset = false) {
    if (this.loading()) return;
    
    const page = reset ? 1 : this.currentPage();
    this.loading.set(true);

    this.getPosts(filter, page).pipe(
      catchError(() => {
        // Return mock data on error for demo purposes
        return of(this.getMockPosts());
      })
    ).subscribe({
      next: (result) => {
        if (reset) {
          this.posts.set(result.items);
        } else {
          this.posts.update(posts => [...posts, ...result.items]);
        }
        this.currentPage.set(page + 1);
        this.hasMore.set(page < result.totalPages);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  // Mock data for demo when API is unavailable
  private getMockPosts(): PagedResult<Post> {
    const mockPosts: Post[] = [
      {
        id: '1', authorId: '1', title: 'Just finished my first oil change! 🔧',
        content: 'Finally did my first DIY oil change on my Honda Civic. Took about 45 minutes but saved $50 compared to the shop.',
        slug: 'first-oil-change', type: 'General', status: 'Published', visibility: 'Public',
        media: [], tags: ['diy', 'maintenance'], viewCount: 245, likeCount: 42, commentCount: 12, shareCount: 5,
        allowComments: true, isPinned: false, isFeatured: true, isLiked: false,
        publishedAt: new Date().toISOString(), createdAt: new Date().toISOString(),
        author: { id: '1', firstName: 'John', lastName: 'Doe', userType: 'Member' }
      },
      {
        id: '2', authorId: '2', title: 'Tesla Model 3 vs BMW i4 - My honest comparison',
        content: 'After test driving both for a week, here\'s my detailed comparison. The Tesla wins on tech and charging network.',
        slug: 'tesla-vs-bmw', type: 'Article', status: 'Published', visibility: 'Public',
        media: [], tags: ['ev', 'comparison'], viewCount: 1250, likeCount: 156, commentCount: 45, shareCount: 23,
        allowComments: true, isPinned: false, isFeatured: true, isLiked: false,
        publishedAt: new Date().toISOString(), createdAt: new Date().toISOString(),
        author: { id: '2', firstName: 'Alice', lastName: 'Smith', userType: 'Expert' }
      },
      {
        id: '3', authorId: '3', title: 'Weekend car meet this Saturday! 🚗',
        content: 'Organizing a casual car meet at Central Park parking lot this Saturday at 3 PM. All car enthusiasts welcome!',
        slug: 'weekend-car-meet', type: 'General', status: 'Published', visibility: 'Public',
        media: [], tags: ['events', 'meetup'], viewCount: 520, likeCount: 89, commentCount: 34, shareCount: 15,
        allowComments: true, isPinned: false, isFeatured: false, isLiked: false,
        publishedAt: new Date().toISOString(), createdAt: new Date().toISOString(),
        author: { id: '3', firstName: 'Bob', lastName: 'Wilson', userType: 'Member' }
      },
      {
        id: '4', authorId: '4', title: 'Restored my grandfather\'s 1967 Mustang',
        content: 'After 2 years of work, I finally finished restoring my grandfather\'s Mustang. He bought it new in \'67.',
        slug: 'restored-mustang', type: 'General', status: 'Published', visibility: 'Public',
        media: [], tags: ['classic', 'restoration'], viewCount: 890, likeCount: 234, commentCount: 67, shareCount: 45,
        allowComments: true, isPinned: false, isFeatured: true, isLiked: false,
        publishedAt: new Date().toISOString(), createdAt: new Date().toISOString(),
        author: { id: '4', firstName: 'Emma', lastName: 'Davis', userType: 'Member' }
      }
    ];
    return { items: mockPosts, totalCount: 4, page: 1, pageSize: 20, totalPages: 1 };
  }
}
