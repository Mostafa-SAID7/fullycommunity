import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PagedResult } from '../../types/common.types';

export interface Page {
  id: string;
  name: string;
  username: string;
  description?: string;
  bio?: string;
  profileImageUrl?: string;
  coverImageUrl?: string;
  category: PageCategory;
  type: PageType;
  isVerified: boolean;
  isPublic: boolean;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  businessHours?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  youTubeUrl?: string;
  linkedInUrl?: string;
  owner: PageOwner;
  followerCount: number;
  postCount: number;
  storyCount: number;
  averageRating: number;
  reviewCount: number;
  isFollowing: boolean;
  isOwner: boolean;
  isAdmin: boolean;
  createdAt: string;
}

export interface PageListItem {
  id: string;
  name: string;
  username: string;
  description?: string;
  profileImageUrl?: string;
  category: PageCategory;
  isVerified: boolean;
  followerCount: number;
  averageRating: number;
  isFollowing: boolean;
}

export interface PageOwner {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  isVerified: boolean;
}

export interface PageReview {
  id: string;
  userId: string;
  user: PageOwner;
  rating: number;
  title?: string;
  content: string;
  imageUrls: string[];
  helpfulCount: number;
  ownerResponse?: string;
  ownerResponseAt?: string;
  createdAt: string;
}

export enum PageCategory {
  Automotive = 'Automotive',
  CarDealer = 'CarDealer',
  AutoRepair = 'AutoRepair',
  CarWash = 'CarWash',
  GasStation = 'GasStation',
  CarRental = 'CarRental',
  AutoParts = 'AutoParts',
  Insurance = 'Insurance',
  Financing = 'Financing',
  CarClub = 'CarClub',
  RacingTeam = 'RacingTeam',
  Blogger = 'Blogger',
  Influencer = 'Influencer',
  Media = 'Media',
  Other = 'Other'
}

export enum PageType {
  Business = 'Business',
  Brand = 'Brand',
  Community = 'Community',
  PublicFigure = 'PublicFigure',
  Organization = 'Organization',
  LocalBusiness = 'LocalBusiness'
}

export interface PageFilter {
  category?: PageCategory;
  searchTerm?: string;
  isVerified?: boolean;
  city?: string;
  state?: string;
  sortBy?: string;
}

export interface CreatePageRequest {
  name: string;
  username: string;
  description?: string;
  bio?: string;
  category: PageCategory;
  type: PageType;
  isPublic: boolean;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
}

export interface UpdatePageRequest {
  name?: string;
  description?: string;
  bio?: string;
  profileImageUrl?: string;
  coverImageUrl?: string;
  category?: PageCategory;
  isPublic?: boolean;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  businessHours?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  youTubeUrl?: string;
  linkedInUrl?: string;
}

export interface CreatePageReviewRequest {
  rating: number;
  title?: string;
  content: string;
  imageUrls?: string[];
}

@Injectable({ providedIn: 'root' })
export class PagesService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/pages`;

  pages = signal<PageListItem[]>([]);
  loading = signal(false);

  getPages(filter: PageFilter = {}, page = 1, pageSize = 20): Observable<PagedResult<PageListItem>> {
    let params = new HttpParams().set('page', page).set('pageSize', pageSize);
    if (filter.category) params = params.set('category', filter.category);
    if (filter.searchTerm) params = params.set('searchTerm', filter.searchTerm);
    if (filter.isVerified !== undefined) params = params.set('isVerified', filter.isVerified);
    if (filter.city) params = params.set('city', filter.city);
    if (filter.state) params = params.set('state', filter.state);
    if (filter.sortBy) params = params.set('sortBy', filter.sortBy);

    return this.http.get<PagedResult<PageListItem>>(this.apiUrl, { params }).pipe(
      catchError(() => of(this.getMockPages()))
    );
  }

  getPage(id: string): Observable<Page> {
    return this.http.get<Page>(`${this.apiUrl}/${id}`).pipe(
      catchError(() => of(this.getMockPageDetails()[0]))
    );
  }

  getPageByUsername(username: string): Observable<Page> {
    return this.http.get<Page>(`${this.apiUrl}/username/${username}`).pipe(
      catchError(() => of(this.getMockPageDetails()[0]))
    );
  }

  createPage(request: CreatePageRequest): Observable<Page> {
    return this.http.post<Page>(this.apiUrl, request);
  }

  updatePage(id: string, request: UpdatePageRequest): Observable<Page> {
    return this.http.put<Page>(`${this.apiUrl}/${id}`, request);
  }

  deletePage(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  followPage(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/follow`, {});
  }

  unfollowPage(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/follow`);
  }

  getPageReviews(id: string, page = 1, pageSize = 20): Observable<PagedResult<PageReview>> {
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);
    return this.http.get<PagedResult<PageReview>>(`${this.apiUrl}/${id}/reviews`, { params }).pipe(
      catchError(() => of(this.getMockReviews()))
    );
  }

  createPageReview(pageId: string, request: CreatePageReviewRequest): Observable<PageReview> {
    return this.http.post<PageReview>(`${this.apiUrl}/${pageId}/reviews`, request);
  }

  getMyPages(): Observable<PageListItem[]> {
    return this.http.get<PageListItem[]>(`${this.apiUrl}/my-pages`).pipe(
      catchError(() => of([]))
    );
  }

  getFollowedPages(): Observable<PageListItem[]> {
    return this.http.get<PageListItem[]>(`${this.apiUrl}/followed`).pipe(
      catchError(() => of([]))
    );
  }

  private getMockPages(): PagedResult<PageListItem> {
    const items: PageListItem[] = [
      {
        id: '1',
        name: 'AutoMax Dealership',
        username: 'automax_official',
        description: 'Your trusted car dealership since 1995. New and used vehicles with exceptional service.',
        profileImageUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop',
        category: PageCategory.CarDealer,
        isVerified: true,
        followerCount: 15420,
        averageRating: 4.8,
        isFollowing: false
      },
      {
        id: '2',
        name: "Mike's Auto Repair",
        username: 'mikes_auto_repair',
        description: 'Professional auto repair services with 20+ years of experience.',
        profileImageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=400&fit=crop',
        category: PageCategory.AutoRepair,
        isVerified: false,
        followerCount: 3200,
        averageRating: 4.6,
        isFollowing: true
      },
      {
        id: '3',
        name: 'CarParts Plus',
        username: 'carparts_plus',
        description: 'Quality auto parts and accessories. Fast shipping nationwide.',
        profileImageUrl: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=400&fit=crop',
        category: PageCategory.AutoParts,
        isVerified: true,
        followerCount: 8900,
        averageRating: 4.4,
        isFollowing: false
      },
      {
        id: '4',
        name: 'Elite Car Wash',
        username: 'elite_car_wash',
        description: 'Premium car wash and detailing services. Your car deserves the best!',
        profileImageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
        category: PageCategory.CarWash,
        isVerified: false,
        followerCount: 2100,
        averageRating: 4.7,
        isFollowing: false
      },
      {
        id: '5',
        name: 'Speed Demons Racing',
        username: 'speed_demons_racing',
        description: 'Professional racing team competing in local and national events.',
        profileImageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=400&fit=crop',
        category: PageCategory.RacingTeam,
        isVerified: true,
        followerCount: 12500,
        averageRating: 4.9,
        isFollowing: false
      }
    ];

    return { items, totalCount: 5, page: 1, pageSize: 20, totalPages: 1 };
  }

  private getMockPageDetails(): Page[] {
    return [
      {
        id: '1',
        name: 'AutoMax Dealership',
        username: 'automax_official',
        description: 'Your trusted car dealership since 1995. New and used vehicles with exceptional service.',
        bio: 'Family-owned dealership serving the community for over 25 years. We specialize in quality pre-owned vehicles and exceptional customer service. Visit our showroom to find your perfect car!',
        profileImageUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop',
        coverImageUrl: 'https://images.unsplash.com/photo-1562141961-d0a6b5b8c3b8?w=1200&h=400&fit=crop',
        category: PageCategory.CarDealer,
        type: PageType.Business,
        isVerified: true,
        isPublic: true,
        email: 'info@automax.com',
        phone: '(555) 123-4567',
        website: 'https://automax.com',
        address: '123 Main Street',
        city: 'Springfield',
        state: 'IL',
        country: 'USA',
        businessHours: '{"monday":"9:00-19:00","tuesday":"9:00-19:00","wednesday":"9:00-19:00","thursday":"9:00-19:00","friday":"9:00-19:00","saturday":"9:00-18:00","sunday":"12:00-17:00"}',
        facebookUrl: 'https://facebook.com/automax',
        instagramUrl: 'https://instagram.com/automax_official',
        twitterUrl: 'https://twitter.com/automax',
        owner: {
          id: '1',
          firstName: 'Robert',
          lastName: 'Johnson',
          avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
          isVerified: false
        },
        followerCount: 15420,
        postCount: 234,
        storyCount: 12,
        averageRating: 4.8,
        reviewCount: 156,
        isFollowing: false,
        isOwner: false,
        isAdmin: false,
        createdAt: new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
  }

  private getMockReviews(): PagedResult<PageReview> {
    const items: PageReview[] = [
      {
        id: '1',
        userId: '1',
        user: {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
          isVerified: false
        },
        rating: 5,
        title: 'Excellent service!',
        content: 'Great experience with this dealership. The staff was professional and helpful throughout the entire process. Highly recommended!',
        imageUrls: [],
        helpfulCount: 12,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        userId: '2',
        user: {
          id: '2',
          firstName: 'Jane',
          lastName: 'Smith',
          avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
          isVerified: false
        },
        rating: 4,
        title: 'Good selection',
        content: 'Found exactly what I was looking for. The prices were fair and the financing options were flexible.',
        imageUrls: [],
        helpfulCount: 8,
        ownerResponse: 'Thank you for choosing AutoMax! We appreciate your business.',
        ownerResponseAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    return { items, totalCount: 2, page: 1, pageSize: 20, totalPages: 1 };
  }
}