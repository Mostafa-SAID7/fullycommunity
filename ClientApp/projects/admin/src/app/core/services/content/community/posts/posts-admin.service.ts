import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import {
  Post,
  PostsListResponse,
  PostActionRequest
} from '../../../../interfaces/content/community/posts/posts-admin.interface';

@Injectable({ providedIn: 'root' })
export class PostsAdminService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/admin/dashboard/community/posts`;

  getPosts(page = 1, pageSize = 20, status?: string, search?: string): Observable<PostsListResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    
    if (status) params = params.set('status', status);
    if (search) params = params.set('search', search);

    return this.http.get<PostsListResponse>(this.apiUrl, { params });
  }

  getPost(id: string): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/${id}`);
  }

  approvePost(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/approve`, {});
  }

  rejectPost(id: string, reason: string): Observable<void> {
    const request: PostActionRequest = { reason };
    return this.http.post<void>(`${this.apiUrl}/${id}/reject`, request);
  }

  deletePost(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
