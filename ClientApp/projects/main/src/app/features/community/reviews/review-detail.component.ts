import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ReviewsService } from '../../../core/services/community/reviews';
import { Review } from '../../../core/interfaces/community/reviews';

@Component({
  selector: 'app-review-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-4xl mx-auto px-4 py-6">
      @if (loading()) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      } @else if (review()) {
        <a routerLink="/community/reviews" class="text-blue-600 hover:underline mb-4 inline-block">← Back to Reviews</a>
        
        <!-- Header -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
          <div class="flex items-center gap-3 mb-4">
            @if (review()!.isExpertReview) {
              <span class="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">Expert Review</span>
            }
            @if (review()!.isVerifiedPurchase) {
              <span class="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Verified Purchase</span>
            }
          </div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">{{ review()!.title }}</h1>
          @if (review()!.carMake && review()!.carModel) {
            <p class="text-lg text-blue-600 dark:text-blue-400 mb-4">
              {{ review()!.carYear }} {{ review()!.carMake }} {{ review()!.carModel }}
            </p>
          }
          
          <!-- Overall Rating -->
          <div class="flex items-center gap-4 mb-6">
            <div class="text-4xl font-bold text-gray-900 dark:text-white">{{ review()!.overallRating }}</div>
            <div>
              <div class="flex text-2xl text-yellow-400">
                @for (star of [1,2,3,4,5]; track star) {
                  <span>{{ star <= review()!.overallRating ? '★' : '☆' }}</span>
                }
              </div>
              <p class="text-sm text-gray-500">Overall Rating</p>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              @if (review()!.authorAvatarUrl) {
                <img [src]="review()!.authorAvatarUrl" [alt]="review()!.authorName" class="w-12 h-12 rounded-full object-cover">
              } @else {
                <div class="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                  {{ review()!.authorName[0] }}
                </div>
              }
              <div>
                <p class="font-medium text-gray-900 dark:text-white">
                  {{ review()!.authorName }}
                </p>
                <p class="text-sm text-gray-500">{{ review()!.publishedAt | date:'MMM d, yyyy' }}</p>
              </div>
            </div>
            <div class="flex gap-3">
              <button (click)="toggleHelpful()" class="px-4 py-2 rounded-lg border hover:bg-gray-50">
                {{ review()!.currentUserFoundHelpful ? '👍' : '👍' }} {{ review()!.helpfulCount }}
              </button>
            </div>
          </div>
        </div>

        <!-- Detailed Ratings -->
        @if (review()!.performanceRating || review()!.comfortRating) {
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
            <h2 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Detailed Ratings</h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              @if (review()!.performanceRating) {
                <div class="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p class="text-2xl font-bold">{{ review()!.performanceRating }}</p>
                  <p class="text-sm text-gray-500">Performance</p>
                </div>
              }
              @if (review()!.comfortRating) {
                <div class="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p class="text-2xl font-bold">{{ review()!.comfortRating }}</p>
                  <p class="text-sm text-gray-500">Comfort</p>
                </div>
              }
              @if (review()!.reliabilityRating) {
                <div class="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p class="text-2xl font-bold">{{ review()!.reliabilityRating }}</p>
                  <p class="text-sm text-gray-500">Reliability</p>
                </div>
              }
              @if (review()!.valueRating) {
                <div class="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p class="text-2xl font-bold">{{ review()!.valueRating }}</p>
                  <p class="text-sm text-gray-500">Value</p>
                </div>
              }
            </div>
          </div>
        }

        <!-- Content -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
          <p class="text-gray-700 dark:text-gray-300 whitespace-pre-line">{{ review()!.content }}</p>
        </div>

        <!-- Pros & Cons -->
        @if (review()!.pros.length > 0 || review()!.cons.length > 0) {
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            @if (review()!.pros.length > 0) {
              <div class="bg-green-50 dark:bg-green-900/20 rounded-xl p-6">
                <h3 class="font-semibold text-green-800 dark:text-green-200 mb-3">👍 Pros</h3>
                <ul class="space-y-2">
                  @for (pro of review()!.pros; track pro) {
                    <li class="text-green-700 dark:text-green-300">✓ {{ pro }}</li>
                  }
                </ul>
              </div>
            }
            @if (review()!.cons.length > 0) {
              <div class="bg-red-50 dark:bg-red-900/20 rounded-xl p-6">
                <h3 class="font-semibold text-red-800 dark:text-red-200 mb-3">👎 Cons</h3>
                <ul class="space-y-2">
                  @for (con of review()!.cons; track con) {
                    <li class="text-red-700 dark:text-red-300">✗ {{ con }}</li>
                  }
                </ul>
              </div>
            }
          </div>
        }
      } @else {
        <div class="text-center py-12">
          <p class="text-4xl mb-4">⭐</p>
          <p class="text-gray-500">Review not found</p>
          <a routerLink="/community/reviews" class="text-blue-600 hover:underline mt-4 inline-block">Browse all reviews</a>
        </div>
      }
    </div>
  `
})
export class ReviewDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private reviewsService = inject(ReviewsService);

  review = signal<Review | null>(null);
  loading = signal(true);

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.reviewsService.getReviewBySlug(slug).subscribe({
        next: (review: any) => { this.review.set(review); this.loading.set(false); },
        error: (err: any) => this.loading.set(false)
      });
    }
  }

  toggleHelpful() {
    const r = this.review();
    if (!r) return;

    if (r.currentUserFoundHelpful) {
      this.reviewsService.unmarkHelpful(r.id).subscribe({
        next: () => {
          this.review.set({
            ...r,
            currentUserFoundHelpful: false,
            helpfulCount: r.helpfulCount - 1
          });
        },
        error: (err: any) => console.error(err)
      });
    } else {
      this.reviewsService.markHelpful(r.id).subscribe({
        next: () => {
          this.review.set({
            ...r,
            currentUserFoundHelpful: true,
            helpfulCount: r.helpfulCount + 1
          });
        },
        error: (err: any) => console.error(err)
      });
    }
  }
}
