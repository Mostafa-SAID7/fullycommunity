import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import {
  Group,
  GroupsListResponse
} from '../../../../interfaces/content/community/groups/groups-admin.interface';

@Injectable({ providedIn: 'root' })
export class GroupsAdminService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/admin/dashboard/community/groups`;

  getGroups(page = 1, pageSize = 20, privacy?: string, search?: string): Observable<GroupsListResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    
    if (privacy) params = params.set('privacy', privacy);
    if (search) params = params.set('search', search);

    return this.http.get<GroupsListResponse>(this.apiUrl, { params });
  }

  getGroup(id: string): Observable<Group> {
    return this.http.get<Group>(`${this.apiUrl}/${id}`);
  }

  deleteGroup(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
