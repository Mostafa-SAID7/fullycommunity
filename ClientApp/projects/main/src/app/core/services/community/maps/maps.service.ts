import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { PagedResult } from '../../../interfaces/common/paged-result.interface';
import {
  MapLocation,
  MapLocationList,
  LocationReview,
  LocationType,
  LocationStatus
} from '../../../interfaces/community/maps';

export interface LocationFilter {
  type?: LocationType;
  status?: LocationStatus;
  city?: string;
  state?: string;
  country?: string;
  searchTerm?: string;
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
  isVerified?: boolean;
  sortBy?: string;
}

export interface CreateLocationRequest {
  name: string;
  description: string | null;
  latitude: number;
  longitude: number;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postalCode: string | null;
  type: LocationType;
  imageUrl?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  openingHours?: string | null;
  isOpen24Hours: boolean;
  features?: string[];
}

export interface UpdateLocationRequest extends Partial<CreateLocationRequest> {}

export interface CreateLocationReviewRequest {
  rating: number;
  title?: string | null;
  content?: string | null;
  serviceRating?: number | null;
  priceRating?: number | null;
  cleanlinessRating?: number | null;
  mediaUrls?: string[];
  visitDate?: string | null;
}

@Injectable({ providedIn: 'root' })
export class MapsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/community/maps`;

  // ============================================================================
  // LOCATION OPERATIONS
  // ============================================================================

  getLocations(filter: LocationFilter = {}, page = 1, pageSize = 20): Observable<PagedResult<MapLocationList>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (filter.type !== undefined) params = params.set('type', filter.type.toString());
    if (filter.status !== undefined) params = params.set('status', filter.status.toString());
    if (filter.city) params = params.set('city', filter.city);
    if (filter.state) params = params.set('state', filter.state);
    if (filter.country) params = params.set('country', filter.country);
    if (filter.searchTerm) params = params.set('searchTerm', filter.searchTerm);
    if (filter.latitude) params = params.set('latitude', filter.latitude.toString());
    if (filter.longitude) params = params.set('longitude', filter.longitude.toString());
    if (filter.radiusKm) params = params.set('radiusKm', filter.radiusKm.toString());
    if (filter.isVerified !== undefined) params = params.set('isVerified', filter.isVerified.toString());
    if (filter.sortBy) params = params.set('sortBy', filter.sortBy);

    return this.http.get<PagedResult<MapLocationList>>(this.apiUrl, { params });
  }

  getLocation(id: string): Observable<MapLocation> {
    return this.http.get<MapLocation>(`${this.apiUrl}/${id}`);
  }

  getLocationBySlug(slug: string): Observable<MapLocation> {
    return this.http.get<MapLocation>(`${this.apiUrl}/slug/${slug}`);
  }

  getNearbyLocations(latitude: number, longitude: number, radiusKm = 10, type?: LocationType): Observable<MapLocationList[]> {
    let params = new HttpParams()
      .set('latitude', latitude.toString())
      .set('longitude', longitude.toString())
      .set('radiusKm', radiusKm.toString());
    
    if (type !== undefined) params = params.set('type', type.toString());

    return this.http.get<MapLocationList[]>(`${this.apiUrl}/nearby`, { params });
  }

  getSavedLocations(page = 1, pageSize = 20): Observable<PagedResult<MapLocationList>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<PagedResult<MapLocationList>>(`${this.apiUrl}/saved`, { params });
  }

  createLocation(request: CreateLocationRequest): Observable<MapLocation> {
    return this.http.post<MapLocation>(this.apiUrl, request);
  }

  updateLocation(id: string, request: UpdateLocationRequest): Observable<MapLocation> {
    return this.http.put<MapLocation>(`${this.apiUrl}/${id}`, request);
  }

  deleteLocation(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // ============================================================================
  // INTERACTION OPERATIONS
  // ============================================================================

  saveLocation(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/save`, {});
  }

  unsaveLocation(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/save`);
  }

  checkIn(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/checkin`, {});
  }

  // ============================================================================
  // REVIEW OPERATIONS
  // ============================================================================

  getReviews(locationId: string, page = 1, pageSize = 20): Observable<PagedResult<LocationReview>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<PagedResult<LocationReview>>(`${this.apiUrl}/${locationId}/reviews`, { params });
  }

  createReview(locationId: string, request: CreateLocationReviewRequest): Observable<LocationReview> {
    return this.http.post<LocationReview>(`${this.apiUrl}/${locationId}/reviews`, request);
  }

  updateReview(locationId: string, reviewId: string, request: Partial<CreateLocationReviewRequest>): Observable<LocationReview> {
    return this.http.put<LocationReview>(`${this.apiUrl}/${locationId}/reviews/${reviewId}`, request);
  }

  deleteReview(locationId: string, reviewId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${locationId}/reviews/${reviewId}`);
  }

  markReviewHelpful(locationId: string, reviewId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${locationId}/reviews/${reviewId}/helpful`, {});
  }
}
