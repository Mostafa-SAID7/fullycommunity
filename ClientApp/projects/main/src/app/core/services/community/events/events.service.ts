import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { PagedResult } from '../../../interfaces/common/paged-result.interface';
import {
  Event,
  EventList,
  EventAttendee,
  EventType,
  EventStatus,
  EventVisibility,
  AttendeeStatus
} from '../../../interfaces/community/events';

export interface EventFilter {
  type?: EventType;
  status?: EventStatus;
  startDate?: string;
  endDate?: string;
  city?: string;
  country?: string;
  searchTerm?: string;
  isFree?: boolean;
  sortBy?: string;
}

export interface CreateEventRequest {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  timezone?: string | null;
  isAllDay: boolean;
  locationType: number;
  venueName?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  onlineUrl?: string | null;
  coverImageUrl?: string | null;
  type: EventType;
  visibility: EventVisibility;
  maxAttendees?: number | null;
  requiresApproval: boolean;
  isFree: boolean;
  price?: number | null;
  currency?: string | null;
  groupId?: string | null;
}

export interface UpdateEventRequest extends Partial<CreateEventRequest> {}

@Injectable({ providedIn: 'root' })
export class EventsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/community/events`;

  // ============================================================================
  // EVENT OPERATIONS
  // ============================================================================

  getEvents(filter: EventFilter = {}, page = 1, pageSize = 20): Observable<PagedResult<EventList>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (filter.type !== undefined) params = params.set('type', filter.type.toString());
    if (filter.status !== undefined) params = params.set('status', filter.status.toString());
    if (filter.startDate) params = params.set('startDate', filter.startDate);
    if (filter.endDate) params = params.set('endDate', filter.endDate);
    if (filter.city) params = params.set('city', filter.city);
    if (filter.country) params = params.set('country', filter.country);
    if (filter.searchTerm) params = params.set('searchTerm', filter.searchTerm);
    if (filter.isFree !== undefined) params = params.set('isFree', filter.isFree.toString());
    if (filter.sortBy) params = params.set('sortBy', filter.sortBy);

    return this.http.get<PagedResult<EventList>>(this.apiUrl, { params });
  }

  getEvent(id: string): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/${id}`);
  }

  getEventBySlug(slug: string): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/slug/${slug}`);
  }

  getMyEvents(page = 1, pageSize = 20): Observable<PagedResult<EventList>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<PagedResult<EventList>>(`${this.apiUrl}/my`, { params });
  }

  getUpcomingEvents(count = 10): Observable<EventList[]> {
    return this.http.get<EventList[]>(`${this.apiUrl}/upcoming`, {
      params: { count: count.toString() }
    });
  }

  createEvent(request: CreateEventRequest): Observable<Event> {
    return this.http.post<Event>(this.apiUrl, request);
  }

  updateEvent(id: string, request: UpdateEventRequest): Observable<Event> {
    return this.http.put<Event>(`${this.apiUrl}/${id}`, request);
  }

  deleteEvent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  cancelEvent(id: string, reason: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/cancel`, { reason });
  }

  // ============================================================================
  // ATTENDEE OPERATIONS
  // ============================================================================

  getAttendees(eventId: string, page = 1, pageSize = 20): Observable<PagedResult<EventAttendee>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<PagedResult<EventAttendee>>(`${this.apiUrl}/${eventId}/attendees`, { params });
  }

  registerForEvent(eventId: string, status: AttendeeStatus): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${eventId}/register`, { status });
  }

  updateAttendeeStatus(eventId: string, status: AttendeeStatus): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${eventId}/status`, { status });
  }

  cancelRegistration(eventId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${eventId}/register`);
  }
}
