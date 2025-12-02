import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { GuidesService, Guide } from '../../../core/services/guides.service';

@Component({
  selector: 'app-guide-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-4xl mx-auto px-4 py-6">
      @if (loading()) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      } @else if (guide()) {
        <a routerLink="/community/guides" class="text-blue-600 hover:underline mb-4 inline-block">← Back to Guides</a>
        
        <!-- Header -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
          <div class="flex items-center gap-3 mb-4">
            <span class="px-3 py-1 rounded-full text-sm" [class]="getDifficultyClass(guide()!.difficulty)">
              {{ guide()!.difficulty }}
            </span>
            <span class="text-gray-500">⏱️ {{ guide()!.estimatedMinutes }} min</span>
            <span class="text-gray-500">👁️ {{ guide()!.viewCount }} views</span>
          </div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">{{ guide()!.title }}</h1>
          <p class="text-gray-600 dark:text-gray-400 mb-6">{{ guide()!.description }}</p>
          
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                {{ guide()!.author.firstName[0] }}{{ guide()!.author.lastName[0] }}
              </div>
              <div>
                <p class="font-medium text-gray-900 dark:text-white">
                  {{ guide()!.author.firstName }} {{ guide()!.author.lastName }}
                  @if (guide()!.author.isVerified) { <span class="text-blue-500">✓</span> }
                </p>
                <p class="text-sm text-gray-500">{{ guide()!.publishedAt | date:'MMM d, yyyy' }}</p>
              </div>
            </div>
            <div class="flex gap-3">
              <button (click)="toggleLike()" class="px-4 py-2 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-700">
                {{ guide()!.isLiked ? '❤️' : '🤍' }} {{ guide()!.likeCount }}
              </button>
              <button (click)="toggleBookmark()" class="px-4 py-2 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-700">
                {{ guide()!.isBookmarked ? '🔖' : '📑' }} Save
              </button>
            </div>
          </div>
        </div>

        <!-- Rating -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
          <div class="flex items-center gap-4">
            <div class="text-center">
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ guide()!.averageRating.toFixed(1) }}</p>
              <div class="flex text-yellow-400">
                @for (star of [1,2,3,4,5]; track star) {
                  <span>{{ star <= guide()!.averageRating ? '★' : '☆' }}</span>
                }
              </div>
              <p class="text-sm text-gray-500">{{ guide()!.ratingCount }} ratings</p>
            </div>
          </div>
        </div>

        <!-- Steps -->
        <div class="space-y-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Steps</h2>
          @for (step of guide()!.steps; track step.id) {
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                  {{ step.stepNumber }}
                </div>
                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">{{ step.title }}</h3>
                  <p class="text-gray-600 dark:text-gray-400 whitespace-pre-line">{{ step.content }}</p>
                  @if (step.tip) {
                    <div class="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p class="text-sm text-blue-800 dark:text-blue-200">💡 Tip: {{ step.tip }}</p>
                    </div>
                  }
                  @if (step.warning) {
                    <div class="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <p class="text-sm text-yellow-800 dark:text-yellow-200">⚠️ Warning: {{ step.warning }}</p>
                    </div>
                  }
                </div>
              </div>
            </div>
          }
        </div>
      } @else {
        <div class="text-center py-12">
          <p class="text-4xl mb-4">📚</p>
          <p class="text-gray-500">Guide not found</p>
          <a routerLink="/community/guides" class="text-blue-600 hover:underline mt-4 inline-block">Browse all guides</a>
        </div>
      }
    </div>
  `
})
export class GuideDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private guidesService = inject(GuidesService);

  guide = signal<Guide | null>(null);
  loading = signal(true);

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.guidesService.getGuideBySlug(slug).subscribe({
        next: (guide) => { this.guide.set(guide); this.loading.set(false); },
        error: () => this.loading.set(false)
      });
    }
  }

  toggleLike() {
    const g = this.guide();
    if (!g) return;
    (g.isLiked ? this.guidesService.unlikeGuide(g.id) : this.guidesService.likeGuide(g.id)).subscribe();
  }

  toggleBookmark() {
    const g = this.guide();
    if (!g) return;
    (g.isBookmarked ? this.guidesService.unbookmarkGuide(g.id) : this.guidesService.bookmarkGuide(g.id)).subscribe();
  }

  getDifficultyClass(difficulty: string): string {
    const classes: Record<string, string> = {
      'Beginner': 'bg-green-100 text-green-800', 'Intermediate': 'bg-yellow-100 text-yellow-800',
      'Advanced': 'bg-orange-100 text-orange-800', 'Expert': 'bg-red-100 text-red-800'
    };
    return classes[difficulty] || classes['Beginner'];
  }
}
