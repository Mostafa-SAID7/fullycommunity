import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PagedResult } from '../../types/common.types';
import {
  Product,
  ProductListItem,
  ProductSearchRequest,
  CreateProductRequest,
  UpdateProductRequest
} from '../../interfaces/marketplace';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private readonly apiUrl = `${environment.apiUrl}/marketplace/products`;

  constructor(private http: HttpClient) {}

  /**
   * Get product by ID
   */
  getById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get product by slug
   */
  getBySlug(slug: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/slug/${slug}`);
  }

  /**
   * Search products
   */
  search(request: ProductSearchRequest): Observable<PagedResult<ProductListItem>> {
    let params = new HttpParams();
    
    if (request.keywords) params = params.set('keywords', request.keywords);
    if (request.category !== null && request.category !== undefined) params = params.set('category', request.category.toString());
    if (request.subCategory) params = params.set('subCategory', request.subCategory);
    if (request.condition !== null && request.condition !== undefined) params = params.set('condition', request.condition.toString());
    if (request.listingType !== null && request.listingType !== undefined) params = params.set('listingType', request.listingType.toString());
    if (request.status !== null && request.status !== undefined) params = params.set('status', request.status.toString());
    if (request.minPrice !== null) params = params.set('minPrice', request.minPrice.toString());
    if (request.maxPrice !== null) params = params.set('maxPrice', request.maxPrice.toString());
    if (request.freeShipping !== null) params = params.set('freeShipping', request.freeShipping.toString());
    if (request.localPickupOnly !== null) params = params.set('localPickupOnly', request.localPickupOnly.toString());
    if (request.sellerId) params = params.set('sellerId', request.sellerId);
    if (request.make) params = params.set('make', request.make);
    if (request.model) params = params.set('model', request.model);
    if (request.year !== null) params = params.set('year', request.year.toString());
    if (request.sortBy) params = params.set('sortBy', request.sortBy);
    params = params.set('sortDescending', request.sortDescending.toString());
    params = params.set('page', request.page.toString());
    params = params.set('pageSize', request.pageSize.toString());
    
    return this.http.get<PagedResult<ProductListItem>>(this.apiUrl, { params });
  }

  /**
   * Get featured products
   */
  getFeatured(pageSize: number = 10): Observable<ProductListItem[]> {
    return this.http.get<ProductListItem[]>(`${this.apiUrl}/featured`, {
      params: { pageSize: pageSize.toString() }
    });
  }

  /**
   * Get trending products
   */
  getTrending(pageSize: number = 20): Observable<ProductListItem[]> {
    return this.http.get<ProductListItem[]>(`${this.apiUrl}/trending`, {
      params: { pageSize: pageSize.toString() }
    });
  }

  /**
   * Get products by seller
   */
  getBySeller(sellerId: string, page: number = 1, pageSize: number = 20): Observable<PagedResult<ProductListItem>> {
    return this.http.get<PagedResult<ProductListItem>>(`${this.apiUrl}/seller/${sellerId}`, {
      params: { page: page.toString(), pageSize: pageSize.toString() }
    });
  }

  /**
   * Create product
   */
  create(request: CreateProductRequest): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, request);
  }

  /**
   * Update product
   */
  update(id: string, request: UpdateProductRequest): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, request);
  }

  /**
   * Delete product
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Watch product
   */
  watch(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/watch`, {});
  }

  /**
   * Unwatch product
   */
  unwatch(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/watch`);
  }

  /**
   * Increment view count
   */
  incrementView(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/view`, {});
  }

  /**
   * Get related products
   */
  getRelated(id: string, limit: number = 10): Observable<ProductListItem[]> {
    return this.http.get<ProductListItem[]>(`${this.apiUrl}/${id}/related`, {
      params: { limit: limit.toString() }
    });
  }
}
