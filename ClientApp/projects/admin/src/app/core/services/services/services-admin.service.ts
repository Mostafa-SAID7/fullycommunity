import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  Service,
  ServiceBooking,
  ServicesListResponse,
  BookingsListResponse,
  ServiceCategory,
  ServiceProvider,
  ServiceStats,
  CreateServiceRequest,
  UpdateServiceRequest,
  UpdateBookingStatusRequest
} from '../../interfaces/services/service-admin.interface';
import { ApiResponse } from '../../interfaces/base/api-response.interface';

@Injectable({ providedIn: 'root' })
export class ServicesAdminService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/admin/dashboard/services`;

  // Services
  getServices(page = 1, pageSize = 20, status?: string, search?: string, type?: string): Observable<ServicesListResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    
    if (status) params = params.set('status', status);
    if (search) params = params.set('search', search);
    if (type) params = params.set('type', type);

    return this.http.get<ServicesListResponse>(this.apiUrl, { params });
  }

  getService(id: string): Observable<ApiResponse<Service>> {
    return this.http.get<ApiResponse<Service>>(`${this.apiUrl}/${id}`);
  }

  getServiceStats(): Observable<ApiResponse<ServiceStats>> {
    return this.http.get<ApiResponse<ServiceStats>>(`${this.apiUrl}/stats`);
  }

  createService(request: CreateServiceRequest): Observable<ApiResponse<Service>> {
    return this.http.post<ApiResponse<Service>>(this.apiUrl, request);
  }

  updateService(id: string, request: UpdateServiceRequest): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.apiUrl}/${id}`, request);
  }

  deleteService(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  approveService(id: string): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/${id}/approve`, {});
  }

  rejectService(id: string, reason: string): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/${id}/reject`, { reason });
  }

  featureService(id: string, featured: boolean): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/${id}/feature`, { featured });
  }

  // Bookings
  getBookings(page = 1, pageSize = 20, status?: string, search?: string): Observable<BookingsListResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    
    if (status) params = params.set('status', status);
    if (search) params = params.set('search', search);

    return this.http.get<BookingsListResponse>(`${this.apiUrl}/bookings`, { params });
  }

  getBooking(id: string): Observable<ApiResponse<ServiceBooking>> {
    return this.http.get<ApiResponse<ServiceBooking>>(`${this.apiUrl}/bookings/${id}`);
  }

  updateBookingStatus(id: string, request: UpdateBookingStatusRequest): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.apiUrl}/bookings/${id}/status`, request);
  }

  cancelBooking(id: string, reason: string): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/bookings/${id}/cancel`, { reason });
  }

  // Categories
  getCategories(): Observable<ApiResponse<ServiceCategory[]>> {
    return this.http.get<ApiResponse<ServiceCategory[]>>(`${this.apiUrl}/categories`);
  }

  createCategory(name: string, description?: string): Observable<ApiResponse<ServiceCategory>> {
    return this.http.post<ApiResponse<ServiceCategory>>(`${this.apiUrl}/categories`, { name, description });
  }

  updateCategory(id: string, name: string, description?: string): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.apiUrl}/categories/${id}`, { name, description });
  }

  deleteCategory(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/categories/${id}`);
  }

  // Providers
  getProviders(page = 1, pageSize = 20, search?: string): Observable<ApiResponse<ServiceProvider[]>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    
    if (search) params = params.set('search', search);

    return this.http.get<ApiResponse<ServiceProvider[]>>(`${this.apiUrl}/providers`, { params });
  }

  verifyProvider(id: string): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/providers/${id}/verify`, {});
  }

  suspendProvider(id: string, reason: string): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/providers/${id}/suspend`, { reason });
  }
}
