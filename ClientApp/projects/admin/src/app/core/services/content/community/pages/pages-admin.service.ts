import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import {
  Page,
  PagesListResponse
} from '../../../../interfaces/content/community/pages/pages-admin.interface';

@Injectable({ providedIn: 'root' })
export class PagesAdminService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/admin/dashboard/community/pages`;

  getPages(page = 1, pageSize = 12, search?: string): Observable<PagesListResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    
    if (search) params = params.set('search', search);

    return this.http.get<PagesListResponse>(this.apiUrl, { params });
  }

  getPage(id: string): Observable<Page> {
    return this.http.get<Page>(`${this.apiUrl}/${id}`);
  }

  verifyPage(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/verify`, {});
  }

  deletePage(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
