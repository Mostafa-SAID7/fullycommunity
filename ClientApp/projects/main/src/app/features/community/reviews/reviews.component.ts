import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReviewsService, ReviewListItem, ReviewSubjectType } from '../../../core/services/community/reviews.service';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 py-6">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Car Reviews</h1>
          <p class="mt-2 text-gray-600 dark:text-gray-400">Real reviews from real car owners and experts</p>
        </div>
        <button class="mt-4 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Write a Review
        </button>
      </div>

      <!-- Filters -->
      <div class="flex flex-wrap gap-4 mb-6">
        <select [(ngModel)]="selectedType" (change)="loadReviews()" 
                class="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700">
          <option value="">All Types</option>
          <option value="Car">Car Reviews</option>
          <option value="Service">Service Reviews</option>
          <option value="Product">Product Reviews</option>
          <option value="Dealership">Dealership Reviews</option>
        </select>
        <input type="text" [(ngModel)]="carMake" placeholder="Car Make (e.g., Toyota)"
               class="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700">
        <input type="text" [(ngModel)]="carModel" placeholder="Car Model (e.g., Camry)"
               class="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700">
        <select [(ngModel)]="sortBy" (change)="loadReviews()" 
                class="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700">
          <option value="newest">Newest</option>
          <option value="helpful">Most Helpful</option>
          <option value="rating_high">Highest Rated</option>
          <option value="rating_low">Lowest Rated</option>
        </select>
        <button (click)="loadReviews()" class="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300">
          Search
        </button>
      </div>

      <!-- Featured Reviews -->
      @if (featuredReviews().length > 0) {
        <div class="mb-8">
          <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Featured Reviews</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            @for (review of featuredReviews(); track review.id) {
              <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 hover:shadow-md transition cursor-pointer"
                   [routerLink]="['/community/reviews', review.slug]">
                <div class="flex items-start justify-between mb-3">
                  <div class="flex items-center gap-2">
                    @if (review.isExpertReview) {
                      <span class="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">Expert</span>
                    }
                    @if (review.isVerifiedPurchase) {
                      <span class="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Verified</span>
                    }
                  </div>
                  <div class="flex items-center">
                    @for (star of [1,2,3,4,5]; track star) {
                      <span [class]="star <= review.overallRating ? 'text-yellow-400' : 'text-gray-300'">★</span>
                    }
                  </div>
                </div>
                <h3 class="font-semibold text-gray-900 dark:text-white mb-2">{{ review.title }}</h3>
                @if (review.carMake && review.carModel) {
                  <p class="text-sm text-blue-600 dark:text-blue-400 mb-2">
                    {{ review.carYear }} {{ review.carMake }} {{ review.carModel }}
                  </p>
                }
                <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{{ review.excerpt }}</p>
                <div class="flex items-center justify-between mt-4 text-sm text-gray-500">
                  <span>By {{ review.author.firstName }} {{ review.author.lastName }}</span>
                  <span>👍 {{ review.helpfulCount }} helpful</span>
                </div>
              </div>
            }
          </div>
        </div>
      }

      <!-- All Reviews -->
      <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">All Reviews</h2>
      @if (loading()) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      } @else {
        <div class="space-y-4">
          @for (review of reviews(); track review.id) {
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 hover:shadow-md transition cursor-pointer"
                 [routerLink]="['/community/reviews', review.slug]">
              <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-2">
                    <div class="flex">
                      @for (star of [1,2,3,4,5]; track star) {
                        <span [class]="star <= review.overallRating ? 'text-yellow-400' : 'text-gray-300'">★</span>
                      }
                    </div>
                    @if (review.isExpertReview) {
                      <span class="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">Expert</span>
                    }
                    @if (review.isVerifiedPurchase) {
                      <span class="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Verified</span>
                    }
                  </div>
                  <h3 class="font-semibold text-gray-900 dark:text-white">{{ review.title }}</h3>
                  @if (review.carMake && review.carModel) {
                    <p class="text-sm text-blue-600 dark:text-blue-400">
                      {{ review.carYear }} {{ review.carMake }} {{ review.carModel }}
                    </p>
                  }
                  <p class="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">{{ review.excerpt }}</p>
                </div>
                <div class="flex md:flex-col items-center md:items-end gap-4 text-sm text-gray-500">
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm">
                      {{ review.author.firstName[0] }}{{ review.author.lastName[0] }}
                    </div>
                    <span>{{ review.author.firstName }}</span>
                  </div>
                  <div class="flex gap-3">
                    <span>👍 {{ review.helpfulCount }}</span>
                    <span>💬 {{ review.commentCount }}</span>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      }

      @if (reviews().length === 0 && !loading()) {
        <div class="text-center py-12 text-gray-500">
          <p class="text-4xl mb-4">⭐</p>
          <p>No reviews found. Be the first to share your experience!</p>
        </div>
      }
    </div>
  `
})
export class ReviewsComponent implements OnInit {
  private reviewsService = inject(ReviewsService);

  reviews = signal<ReviewListItem[]>([]);
  featuredReviews = signal<ReviewListItem[]>([]);
  loading = signal(false);
  
  selectedType = '';
  carMake = '';
  carModel = '';
  sortBy = 'newest';

  ngOnInit() {
    this.loadReviews();
    this.loadFeaturedReviews();
  }

  loadReviews() {
    this.loading.set(true);
    this.reviewsService.getReviews({
      subjectType: this.selectedType as ReviewSubjectType || undefined,
      carMake: this.carMake || undefined,
      carModel: this.carModel || undefined,
      sortBy: this.sortBy
    }).subscribe({
      next: (result) => {
        this.reviews.set(result.items);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  loadFeaturedReviews() {
    this.reviewsService.getFeaturedReviews(4).subscribe({
      next: (reviews) => this.featuredReviews.set(reviews)
    });
  }
}
