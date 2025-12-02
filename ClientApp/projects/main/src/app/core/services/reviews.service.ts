import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PagedResult } from './community.service';

export interface Review {
  id: string;
  title: string;
  slug: string;
  content: string;
  authorId: string;
  author: ReviewAuthor;
  subjectType: ReviewSubjectType;
  carMake?: string;
  carModel?: string;
  carYear?: number;
  overallRating: number;
  performanceRating?: number;
  comfortRating?: number;
  reliabilityRating?: number;
  valueRating?: number;
  fuelEconomyRating?: number;
  styleRating?: number;
  technologyRating?: number;
  pros: string[];
  cons: string[];
  ownershipStatus?: string;
  ownershipDuration?: string;
  milesDriven?: number;
  isVerifiedPurchase: boolean;
  isExpertReview: boolean;
  helpfulCount: number;
  notHelpfulCount: number;
  commentCount: number;
  viewCount: number;
  status: string;
  publishedAt: string;
  createdAt: string;
}

export interface ReviewListItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: ReviewAuthor;
  subjectType: ReviewSubjectType;
  carMake?: string;
  carModel?: string;
  carYear?: number;
  overallRating: number;
  isVerifiedPurchase: boolean;
  isExpertReview: boolean;
  helpfulCount: number;
  commentCount: number;
  publishedAt: string;
}

export interface ReviewAuthor {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  isVerified: boolean;
}


export type ReviewSubjectType = 'Car' | 'Service' | 'Product' | 'Dealership' | 'Garage' | 'Other';

export interface ReviewComment {
  id: string;
  reviewId: string;
  authorId: string;
  author: ReviewAuthor;
  content: string;
  parentId?: string;
  likeCount: number;
  createdAt: string;
}

export interface ReviewFilter {
  subjectType?: ReviewSubjectType;
  carMake?: string;
  carModel?: string;
  carYear?: number;
  minRating?: number;
  maxRating?: number;
  isVerifiedPurchase?: boolean;
  isExpertReview?: boolean;
  searchTerm?: string;
  sortBy?: string;
}

export interface CreateReviewRequest {
  title: string;
  content: string;
  subjectType: ReviewSubjectType;
  carMake?: string;
  carModel?: string;
  carYear?: number;
  overallRating: number;
  performanceRating?: number;
  comfortRating?: number;
  reliabilityRating?: number;
  valueRating?: number;
  fuelEconomyRating?: number;
  styleRating?: number;
  technologyRating?: number;
  pros?: string[];
  cons?: string[];
  ownershipStatus?: string;
  ownershipDuration?: string;
  milesDriven?: number;
}

export interface CarReviewSummary {
  make: string;
  model: string;
  year?: number;
  totalReviews: number;
  averageOverallRating: number;
  averagePerformanceRating?: number;
  averageComfortRating?: number;
  averageReliabilityRating?: number;
  averageValueRating?: number;
  topPros: string[];
  topCons: string[];
  ratingDistribution: { [key: number]: number };
}

@Injectable({ providedIn: 'root' })
export class ReviewsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/community/reviews`;

  reviews = signal<ReviewListItem[]>([]);
  loading = signal(false);

  getReviews(filter: ReviewFilter = {}, page = 1, pageSize = 20): Observable<PagedResult<ReviewListItem>> {
    let params = new HttpParams().set('page', page).set('pageSize', pageSize);
    if (filter.subjectType) params = params.set('subjectType', filter.subjectType);
    if (filter.carMake) params = params.set('carMake', filter.carMake);
    if (filter.carModel) params = params.set('carModel', filter.carModel);
    if (filter.minRating) params = params.set('minRating', filter.minRating);
    if (filter.searchTerm) params = params.set('searchTerm', filter.searchTerm);
    if (filter.sortBy) params = params.set('sortBy', filter.sortBy);
    return this.http.get<PagedResult<ReviewListItem>>(this.apiUrl, { params }).pipe(
      catchError(() => of(this.getMockReviews()))
    );
  }

  getReview(id: string): Observable<Review> {
    return this.http.get<Review>(`${this.apiUrl}/${id}`);
  }

  getReviewBySlug(slug: string): Observable<Review> {
    return this.http.get<Review>(`${this.apiUrl}/slug/${slug}`);
  }

  getFeaturedReviews(count = 10): Observable<ReviewListItem[]> {
    return this.http.get<ReviewListItem[]>(`${this.apiUrl}/featured`, { params: { count } }).pipe(
      catchError(() => of(this.getMockReviews().items))
    );
  }

  getCarReviews(make: string, model: string, year?: number, page = 1, pageSize = 20): Observable<PagedResult<ReviewListItem>> {
    let params = new HttpParams().set('page', page).set('pageSize', pageSize);
    if (year) params = params.set('year', year);
    return this.http.get<PagedResult<ReviewListItem>>(`${this.apiUrl}/car/${make}/${model}`, { params });
  }

  getCarReviewSummary(make: string, model: string, year?: number): Observable<CarReviewSummary> {
    let params = new HttpParams();
    if (year) params = params.set('year', year);
    return this.http.get<CarReviewSummary>(`${this.apiUrl}/car/${make}/${model}/summary`, { params });
  }

  createReview(request: CreateReviewRequest): Observable<Review> {
    return this.http.post<Review>(this.apiUrl, request);
  }

  updateReview(id: string, request: Partial<CreateReviewRequest>): Observable<Review> {
    return this.http.put<Review>(`${this.apiUrl}/${id}`, request);
  }

  deleteReview(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  markHelpful(id: string, isHelpful: boolean): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/helpful`, { isHelpful });
  }

  getComments(reviewId: string, page = 1): Observable<PagedResult<ReviewComment>> {
    return this.http.get<PagedResult<ReviewComment>>(`${this.apiUrl}/${reviewId}/comments`, { params: { page } });
  }

  addComment(reviewId: string, content: string, parentId?: string): Observable<ReviewComment> {
    return this.http.post<ReviewComment>(`${this.apiUrl}/${reviewId}/comments`, { content, parentId });
  }

  private getMockReviews(): PagedResult<ReviewListItem> {
    const items: ReviewListItem[] = [
      {
        id: '1', title: '2024 Tesla Model 3 - Best EV I\'ve Owned', slug: 'tesla-model-3-review',
        excerpt: 'After 6 months with the Model 3, I can confidently say it\'s the best electric vehicle...',
        author: { id: '1', firstName: 'John', lastName: 'Smith', isVerified: true },
        subjectType: 'Car', carMake: 'Tesla', carModel: 'Model 3', carYear: 2024,
        overallRating: 5, isVerifiedPurchase: true, isExpertReview: false,
        helpfulCount: 156, commentCount: 34, publishedAt: new Date().toISOString()
      },
      {
        id: '2', title: 'BMW X5 - Luxury SUV Done Right', slug: 'bmw-x5-review',
        excerpt: 'The X5 combines luxury, performance, and practicality in a way few SUVs can match...',
        author: { id: '2', firstName: 'Emily', lastName: 'Davis', isVerified: true },
        subjectType: 'Car', carMake: 'BMW', carModel: 'X5', carYear: 2023,
        overallRating: 4, isVerifiedPurchase: true, isExpertReview: true,
        helpfulCount: 89, commentCount: 21, publishedAt: new Date().toISOString()
      },
      {
        id: '3', title: 'Excellent Service at Downtown Auto', slug: 'downtown-auto-service-review',
        excerpt: 'Had my car serviced here and the experience was outstanding. Professional staff...',
        author: { id: '3', firstName: 'Mike', lastName: 'Wilson', isVerified: false },
        subjectType: 'Service', overallRating: 5, isVerifiedPurchase: true, isExpertReview: false,
        helpfulCount: 45, commentCount: 8, publishedAt: new Date().toISOString()
      }
    ];
    return { items, totalCount: 3, page: 1, pageSize: 20, totalPages: 1 };
  }
}
