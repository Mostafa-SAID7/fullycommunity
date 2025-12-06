import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface FeaturedPost {
  id: string;
  title: string;
  excerpt: string;
  authorName: string;
  likeCount: number;
  commentCount: number;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class FeaturedPostsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/community`;

  getFeaturedPosts(): Observable<FeaturedPost[]> {
    return this.http.get<FeaturedPost[]>(`${this.apiUrl}/featured-posts`);
  }


}