import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PagedResult } from '../../types/common.types';

export interface MapLocation {
  id: string;
  name: string;
  slug: string;
  description?: string;
  addedById?: string;
  addedBy?: LocationUser;
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  type: LocationType;
  status: string;
  imageUrl?: string;
  phone?: string;
  email?: string;
  website?: string;
  openingHours?: string;
  isOpen24Hours: boolean;
  features: string[];
  averageRating: number;
  reviewCount: number;
  checkInCount: number;
  saveCount: number;
  isVerified: boolean;
  isClaimedByOwner: boolean;
  isSaved?: boolean;
  createdAt: string;
}

export interface MapLocationListItem {
  id: string;
  name: string;
  slug: string;
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  type: LocationType;
  imageUrl?: string;
  averageRating: number;
  reviewCount: number;
  isVerified: boolean;
  isOpen24Hours: boolean;
  distance?: number;
}

export interface LocationUser {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
}


export type LocationType = 'GasStation' | 'ChargingStation' | 'CarWash' | 'Garage' | 'Dealership' |
  'PartsStore' | 'ParkingLot' | 'ScenicRoute' | 'MeetupSpot' | 'RaceTrack' | 'CarMuseum' | 'DrivingSchool' | 'InspectionCenter' | 'Other';

export interface LocationReview {
  id: string;
  locationId: string;
  userId: string;
  user: LocationUser;
  rating: number;
  title?: string;
  content: string;
  visitDate?: string;
  photos: string[];
  helpfulCount: number;
  ownerResponse?: string;
  createdAt: string;
}

export interface LocationFilter {
  type?: LocationType;
  city?: string;
  country?: string;
  minRating?: number;
  isVerified?: boolean;
  isOpen24Hours?: boolean;
  features?: string[];
  searchTerm?: string;
  sortBy?: string;
}

export interface NearbySearchRequest {
  latitude: number;
  longitude: number;
  radiusKm?: number;
  type?: LocationType;
  count?: number;
}

export interface CreateLocationRequest {
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  type: LocationType;
  phone?: string;
  email?: string;
  website?: string;
  openingHours?: string;
  isOpen24Hours?: boolean;
  features?: string[];
  imageUrl?: string;
}

export interface CreateLocationReviewRequest {
  rating: number;
  title?: string;
  content: string;
  visitDate?: string;
  photos?: string[];
}

@Injectable({ providedIn: 'root' })
export class MapsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/community/maps`;

  locations = signal<MapLocationListItem[]>([]);
  loading = signal(false);

  getLocations(filter: LocationFilter = {}, page = 1, pageSize = 20): Observable<PagedResult<MapLocationListItem>> {
    let params = new HttpParams().set('page', page).set('pageSize', pageSize);
    if (filter.type) params = params.set('type', filter.type);
    if (filter.city) params = params.set('city', filter.city);
    if (filter.searchTerm) params = params.set('searchTerm', filter.searchTerm);
    if (filter.sortBy) params = params.set('sortBy', filter.sortBy);
    return this.http.get<PagedResult<MapLocationListItem>>(`${this.apiUrl}/locations`, { params }).pipe(
      catchError(() => of(this.getMockLocations()))
    );
  }

  getLocation(id: string): Observable<MapLocation> {
    return this.http.get<MapLocation>(`${this.apiUrl}/locations/${id}`);
  }

  getLocationBySlug(slug: string): Observable<MapLocation> {
    return this.http.get<MapLocation>(`${this.apiUrl}/locations/slug/${slug}`);
  }

  getNearbyLocations(request: NearbySearchRequest): Observable<MapLocationListItem[]> {
    const params = new HttpParams()
      .set('latitude', request.latitude)
      .set('longitude', request.longitude)
      .set('radiusKm', request.radiusKm || 10)
      .set('count', request.count || 20);
    return this.http.get<MapLocationListItem[]>(`${this.apiUrl}/locations/nearby`, { params }).pipe(
      catchError(() => of(this.getMockLocations().items))
    );
  }

  searchLocations(query: string, type?: LocationType, count = 20): Observable<MapLocationListItem[]> {
    let params = new HttpParams().set('query', query).set('count', count);
    if (type) params = params.set('type', type);
    return this.http.get<MapLocationListItem[]>(`${this.apiUrl}/locations/search`, { params });
  }

  createLocation(request: CreateLocationRequest): Observable<MapLocation> {
    return this.http.post<MapLocation>(`${this.apiUrl}/locations`, request);
  }

  getLocationReviews(locationId: string, page = 1, pageSize = 20): Observable<PagedResult<LocationReview>> {
    return this.http.get<PagedResult<LocationReview>>(`${this.apiUrl}/locations/${locationId}/reviews`, {
      params: { page, pageSize }
    });
  }

  addLocationReview(locationId: string, request: CreateLocationReviewRequest): Observable<LocationReview> {
    return this.http.post<LocationReview>(`${this.apiUrl}/locations/${locationId}/reviews`, request);
  }

  saveLocation(locationId: string, listName?: string, note?: string): Observable<void> {
    let params = new HttpParams();
    if (listName) params = params.set('listName', listName);
    if (note) params = params.set('note', note);
    return this.http.post<void>(`${this.apiUrl}/locations/${locationId}/save`, {}, { params });
  }

  unsaveLocation(locationId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/locations/${locationId}/save`);
  }

  checkIn(locationId: string, note?: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/locations/${locationId}/checkin`, { note });
  }

  private getMockLocations(): PagedResult<MapLocationListItem> {
    const items: MapLocationListItem[] = [
      {
        id: '1', name: 'Tesla Supercharger - Downtown', slug: 'tesla-supercharger-downtown',
        latitude: 40.7128, longitude: -74.0060, address: '123 Main St', city: 'New York',
        type: 'ChargingStation', averageRating: 4.5, reviewCount: 89, isVerified: true, isOpen24Hours: true
      },
      {
        id: '2', name: 'AutoZone - Main Street', slug: 'autozone-main-street',
        latitude: 40.7580, longitude: -73.9855, address: '456 Broadway', city: 'New York',
        type: 'PartsStore', averageRating: 4.2, reviewCount: 156, isVerified: true, isOpen24Hours: false
      },
      {
        id: '3', name: 'Quick Lube Express', slug: 'quick-lube-express',
        latitude: 40.7484, longitude: -73.9857, address: '789 5th Ave', city: 'New York',
        type: 'Garage', averageRating: 3.8, reviewCount: 67, isVerified: false, isOpen24Hours: false
      },
      {
        id: '4', name: 'Scenic Mountain Drive Viewpoint', slug: 'scenic-mountain-viewpoint',
        latitude: 40.7829, longitude: -73.9654, address: 'Mountain Rd', city: 'Upstate',
        type: 'ScenicRoute', averageRating: 4.9, reviewCount: 234, isVerified: true, isOpen24Hours: true
      }
    ];
    return { items, totalCount: 4, page: 1, pageSize: 20, totalPages: 1 };
  }
}
