import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { PagedResult } from '../../../interfaces/common/paged-result.interface';
import {
  Post,
  PostList,
  CreatePostRequest,
  UpdatePostRequest,
  CreateCommentRequest,
  PostFilter,
  PostComment
} from '../../../interfaces/community/posts';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/community/posts`;

  // ============================================================================
  // POST OPERATIONS
  // ============================================================================

  getPosts(filter: PostFilter = {}, page = 1, pageSize = 20): Observable<PagedResult<PostList>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (filter.type) params = params.set('type', filter.type);
    if (filter.categoryId) params = params.set('categoryId', filter.categoryId);
    if (filter.searchTerm) params = params.set('searchTerm', filter.searchTerm);
    if (filter.tag) params = params.set('tag', filter.tag);
    if (filter.sortBy) params = params.set('sortBy', filter.sortBy);

    return this.http.get<PagedResult<PostList>>(this.apiUrl, { params });
  }

  getPost(id: string): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/${id}`);
  }

  getPostBySlug(slug: string): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/slug/${slug}`);
  }

  getUserPosts(userId: string, page = 1, pageSize = 20): Observable<PagedResult<PostList>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<PagedResult<PostList>>(`${this.apiUrl}/user/${userId}`, { params });
  }

  createPost(request: CreatePostRequest): Observable<Post> {
    return this.http.post<Post>(this.apiUrl, request);
  }

  updatePost(id: string, request: UpdatePostRequest): Observable<Post> {
    return this.http.put<Post>(`${this.apiUrl}/${id}`, request);
  }

  deletePost(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // ============================================================================
  // INTERACTION OPERATIONS
  // ============================================================================

  likePost(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/like`, {});
  }

  unlikePost(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/like`);
  }

  sharePost(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/share`, {});
  }

  // ============================================================================
  // COMMENT OPERATIONS
  // ============================================================================

  getComments(postId: string): Observable<PostComment[]> {
    return this.http.get<PostComment[]>(`${this.apiUrl}/${postId}/comments`);
  }

  createComment(postId: string, request: CreateCommentRequest): Observable<PostComment> {
    return this.http.post<PostComment>(`${this.apiUrl}/${postId}/comments`, request);
  }

  deleteComment(postId: string, commentId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${postId}/comments/${commentId}`);
  }
}
