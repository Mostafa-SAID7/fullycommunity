import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PagedResult } from '../../types/common.types';
import {
  ServiceProvider,
  NearbyProvider,
  ServiceSearchRequest,
  CreateServiceProviderRequest,
  UpdateServiceProviderRequest
} from '../../interfaces/services';

@Injectable({
  providedIn: 'root'
})
export class ServiceProvidersService {
  private readonly apiUrl = `${environment.apiUrl}/services/providers`;

  constructor(private http: HttpClient) {}

  /**
   * Get provider by ID
   */
  getById(id: string): Observable<ServiceProvider> {
    return this.http.get<ServiceProvider>(`${this.apiUrl}/${id}`);
  }

  /**
   * Search providers
   */
  search(request: ServiceSearchRequest): Observable<PagedResult<ServiceProvider>> {
    let params = new HttpParams();
    
    if (request.category !== null && request.category !== undefined) params = params.set('category', request.category.toString());
    if (request.latitude !== null) params = params.set('latitude', request.latitude.toString());
    if (request.longitude !== null) params = params.set('longitude', request.longitude.toString());
    if (request.radiusKm !== null) params = params.set('radiusKm', request.radiusKm.toString());
    if (request.city) params = params.set('city', request.city);
    if (request.minRating !== null) params = params.set('minRating', request.minRating.toString());
    if (request.is24Hours !== null) params = params.set('is24Hours', request.is24Hours.toString());
    if (request.isVerified !== null) params = params.set('isVerified', request.isVerified.toString());
    if (request.sortBy) params = params.set('sortBy', request.sortBy);
    params = params.set('sortDescending', request.sortDescending.toString());
    params = params.set('page', request.page.toString());
    params = params.set('pageSize', request.pageSize.toString());
    
    return this.http.get<PagedResult<ServiceProvider>>(this.apiUrl, { params });
  }

  /**
   * Get nearby providers
   */
  getNearby(latitude: number, longitude: number, radiusKm: number = 25): Observable<NearbyProvider[]> {
    return this.http.get<NearbyProvider[]>(`${this.apiUrl}/nearby`, {
      params: {
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        radiusKm: radiusKm.toString()
      }
    });
  }

  /**
   * Create provider
   */
  create(request: CreateServiceProviderRequest): Observable<ServiceProvider> {
    return this.http.post<ServiceProvider>(this.apiUrl, request);
  }

  /**
   * Update provider
   */
  update(id: string, request: UpdateServiceProviderRequest): Observable<ServiceProvider> {
    return this.http.put<ServiceProvider>(`${this.apiUrl}/${id}`, request);
  }

  /**
   * Delete provider
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get provider stats
   */
  getStats(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/stats`);
  }
}
