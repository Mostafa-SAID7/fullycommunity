import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PagedResult } from '../../types/common.types';
import {
  ProductReview,
  SellerReview,
  ReviewSummary,
  CreateProductReviewRequest,
  CreateSellerReviewRequest,
  RespondToReviewRequest
} from '../../interfaces/marketplace';

@Injectable({
  providedIn: 'root'
})
export class MarketplaceReviewsService {
  private readonly apiUrl = `${environment.apiUrl}/marketplace/reviews`;

  constructor(private http: HttpClient) {}

  getProductReviews(productId: string, page: number = 1, pageSize: number = 20): Observable<PagedResult<ProductReview>> {
    return this.http.get<PagedResult<ProductReview>>(`${this.apiUrl}/products/${productId}`, {
      params: { page: page.toString(), pageSize: pageSize.toString() }
    });
  }

  getProductReviewSummary(productId: string): Observable<ReviewSummary> {
    return this.http.get<ReviewSummary>(`${this.apiUrl}/products/${productId}/summary`);
  }

  createProductReview(request: CreateProductReviewRequest): Observable<ProductReview> {
    return this.http.post<ProductReview>(`${this.apiUrl}/products`, request);
  }

  getSellerReviews(sellerId: string, page: number = 1, pageSize: number = 20): Observable<PagedResult<SellerReview>> {
    return this.http.get<PagedResult<SellerReview>>(`${this.apiUrl}/sellers/${sellerId}`, {
      params: { page: page.toString(), pageSize: pageSize.toString() }
    });
  }

  getSellerReviewSummary(sellerId: string): Observable<ReviewSummary> {
    return this.http.get<ReviewSummary>(`${this.apiUrl}/sellers/${sellerId}/summary`);
  }

  createSellerReview(request: CreateSellerReviewRequest): Observable<SellerReview> {
    return this.http.post<SellerReview>(`${this.apiUrl}/sellers`, request);
  }

  respondToReview(reviewId: string, request: RespondToReviewRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${reviewId}/respond`, request);
  }

  markReviewHelpful(reviewId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${reviewId}/helpful`, {});
  }

  markReviewNotHelpful(reviewId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${reviewId}/not-helpful`, {});
  }
}
