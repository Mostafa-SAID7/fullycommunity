import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PagedResult } from '../../types/common.types';

export interface Group {
  id: string;
  name: string;
  description: string;
  coverImageUrl?: string;
  memberCount: number;
  privacy: 'Public' | 'Private';
  createdAt: string;
  isJoined?: boolean;
}



@Injectable({ providedIn: 'root' })
export class GroupsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/community/groups`;

  groups = signal<Group[]>([]);
  myGroups = signal<Group[]>([]);
  loading = signal(false);

  getGroups(search?: string, page = 1, pageSize = 20): Observable<PagedResult<Group>> {
    const params: any = { page, pageSize };
    if (search) params.search = search;
    
    return this.http.get<PagedResult<Group>>(this.apiUrl, { params }).pipe(
      catchError(() => of(this.getMockGroups()))
    );
  }

  getGroup(id: string): Observable<Group> {
    return this.http.get<Group>(`${this.apiUrl}/${id}`);
  }

  getMyGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.apiUrl}/my`).pipe(
      catchError(() => of([]))
    );
  }

  joinGroup(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/join`, {});
  }

  leaveGroup(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/leave`);
  }

  loadGroups(search?: string) {
    this.loading.set(true);
    this.getGroups(search).subscribe({
      next: (result) => {
        this.groups.set(result.items);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  private getMockGroups(): PagedResult<Group> {
    return {
      items: [
        { id: '1', name: 'Car Enthusiasts', description: 'For all car lovers', memberCount: 15420, privacy: 'Public', createdAt: new Date().toISOString(), isJoined: true },
        { id: '2', name: 'DIY Mechanics', description: 'Fix it yourself', memberCount: 8750, privacy: 'Public', createdAt: new Date().toISOString(), isJoined: true },
        { id: '3', name: 'Electric Vehicles Club', description: 'EV owners unite', memberCount: 12300, privacy: 'Public', createdAt: new Date().toISOString(), isJoined: false },
        { id: '4', name: 'Classic Cars', description: 'Vintage beauty', memberCount: 6200, privacy: 'Private', createdAt: new Date().toISOString(), isJoined: false },
        { id: '5', name: 'Racing Community', description: 'Speed lovers', memberCount: 9800, privacy: 'Public', createdAt: new Date().toISOString(), isJoined: true }
      ],
      totalCount: 5,
      page: 1,
      pageSize: 20,
      totalPages: 1
    };
  }
}
