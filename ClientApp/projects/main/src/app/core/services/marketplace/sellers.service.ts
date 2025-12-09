import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PagedResult } from '../../types/common.types';
import {
  Seller,
  SellerStats,
  SellerSearchRequest,
  CreateSellerRequest,
  UpdateSellerRequest
} from '../../interfaces/marketplace';

@Injectable({
  providedIn: 'root'
})
export class SellersService {
  private readonly apiUrl = `${environment.apiUrl}/marketplace/sellers`;

  constructor(private http: HttpClient) {}

  getById(id: string): Observable<Seller> {
    return this.http.get<Seller>(`${this.apiUrl}/${id}`);
  }

  getBySlug(slug: string): Observable<Seller> {
    return this.http.get<Seller>(`${this.apiUrl}/slug/${slug}`);
  }

  search(request: SellerSearchRequest): Observable<PagedResult<Seller>> {
    let params = new HttpParams();
    if (request.keywords) params = params.set('keywords', request.keywords);
    if (request.category !== null && request.category !== undefined) params = params.set('category', request.category.toString());
    if (request.location) params = params.set('location', request.location);
    if (request.type !== null && request.type !== undefined) params = params.set('type', request.type.toString());
    if (request.minRating !== null) params = params.set('minRating', request.minRating.toString());
    if (request.isVerified !== null) params = params.set('isVerified', request.isVerified.toString());
    if (request.sortBy) params = params.set('sortBy', request.sortBy);
    params = params.set('sortDescending', request.sortDescending.toString());
    params = params.set('page', request.page.toString());
    params = params.set('pageSize', request.pageSize.toString());
    return this.http.get<PagedResult<Seller>>(this.apiUrl, { params });
  }

  create(request: CreateSellerRequest): Observable<Seller> {
    return this.http.post<Seller>(this.apiUrl, request);
  }

  update(id: string, request: UpdateSellerRequest): Observable<Seller> {
    return this.http.put<Seller>(`${this.apiUrl}/${id}`, request);
  }

  getStats(id: string): Observable<SellerStats> {
    return this.http.get<SellerStats>(`${this.apiUrl}/${id}/stats`);
  }

  follow(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/follow`, {});
  }

  unfollow(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/follow`);
  }
}
