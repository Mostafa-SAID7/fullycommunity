import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PagedResult } from '../../types/common.types';
import {
  Booking,
  TimeSlot,
  CreateBookingRequest,
  UpdateBookingStatusRequest,
  CreateTimeSlotsRequest
} from '../../interfaces/services';

@Injectable({
  providedIn: 'root'
})
export class BookingsService {
  private readonly apiUrl = `${environment.apiUrl}/services/bookings`;

  constructor(private http: HttpClient) {}

  /**
   * Get booking by ID
   */
  getById(id: string): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get booking by number
   */
  getByNumber(bookingNumber: string): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/number/${bookingNumber}`);
  }

  /**
   * Get user bookings
   */
  getMyBookings(page: number = 1, pageSize: number = 20): Observable<PagedResult<Booking>> {
    return this.http.get<PagedResult<Booking>>(`${this.apiUrl}/my-bookings`, {
      params: { page: page.toString(), pageSize: pageSize.toString() }
    });
  }

  /**
   * Get provider bookings
   */
  getProviderBookings(providerId: string, page: number = 1, pageSize: number = 20): Observable<PagedResult<Booking>> {
    return this.http.get<PagedResult<Booking>>(`${this.apiUrl}/provider/${providerId}`, {
      params: { page: page.toString(), pageSize: pageSize.toString() }
    });
  }

  /**
   * Create booking
   */
  create(request: CreateBookingRequest): Observable<Booking> {
    return this.http.post<Booking>(this.apiUrl, request);
  }

  /**
   * Update booking status
   */
  updateStatus(id: string, request: UpdateBookingStatusRequest): Observable<Booking> {
    return this.http.put<Booking>(`${this.apiUrl}/${id}/status`, request);
  }

  /**
   * Cancel booking
   */
  cancel(id: string, reason: string): Observable<Booking> {
    return this.http.post<Booking>(`${this.apiUrl}/${id}/cancel`, { reason });
  }

  /**
   * Get available time slots
   */
  getTimeSlots(providerId: string, date: string): Observable<TimeSlot[]> {
    return this.http.get<TimeSlot[]>(`${this.apiUrl}/providers/${providerId}/time-slots`, {
      params: { date }
    });
  }

  /**
   * Create time slots
   */
  createTimeSlots(providerId: string, request: CreateTimeSlotsRequest): Observable<TimeSlot[]> {
    return this.http.post<TimeSlot[]>(`${this.apiUrl}/providers/${providerId}/time-slots`, request);
  }

  /**
   * Rate booking
   */
  rate(id: string, rating: number, comment?: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/rate`, { rating, comment });
  }
}
