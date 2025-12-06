import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface PopularCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  postCount: number;
  isActive: boolean;
}

@Injectable({ providedIn: 'root' })
export class PopularCategoriesService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/community`;

  getPopularCategories(): Observable<PopularCategory[]> {
    return this.http.get<PopularCategory[]>(`${this.apiUrl}/popular-categories`);
  }


}