import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import {
  Event,
  EventsListResponse
} from '../../../../interfaces/content/community/events/events-admin.interface';

@Injectable({ providedIn: 'root' })
export class EventsAdminService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/admin/dashboard/community/events`;

  getEvents(page = 1, pageSize = 12, status?: string, search?: string): Observable<EventsListResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    
    if (status) params = params.set('status', status);
    if (search) params = params.set('search', search);

    return this.http.get<EventsListResponse>(this.apiUrl, { params });
  }

  getEvent(id: string): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/${id}`);
  }

  cancelEvent(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/cancel`, {});
  }

  deleteEvent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
