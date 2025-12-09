import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NewsService } from '../../../core/services/community/news';
import { NewsArticle, NewsList } from '../../../core/interfaces/community/news';

@Component({
  selector: 'app-news-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-4xl mx-auto px-4 py-6">
      @if (loading()) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      } @else if (article()) {
        <a routerLink="/community/news" class="text-blue-600 hover:underline mb-4 inline-block">← Back to News</a>
        
        <!-- Header -->
        <article class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden mb-6">
          @if (article()!.coverImageUrl) {
            <img [src]="article()!.coverImageUrl" [alt]="article()!.title" class="w-full h-64 object-cover">
          }
          <div class="p-6">
            <div class="flex items-center gap-3 mb-4">
              @if (article()!.isBreaking) {
                <span class="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded">BREAKING</span>
              }
              @if (article()!.category) {
                <span class="text-sm text-blue-600 dark:text-blue-400 font-medium">{{ article()!.category!.name }}</span>
              }
            </div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">{{ article()!.title }}</h1>
            
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  {{ article()!.author.firstName[0] }}{{ article()!.author.lastName[0] }}
                </div>
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">
                    {{ article()!.author.firstName }} {{ article()!.author.lastName }}
                  </p>
                  <p class="text-sm text-gray-500">{{ article()!.publishedAt | date:'MMM d, yyyy' }}</p>
                </div>
              </div>
              <div class="flex items-center gap-4 text-sm text-gray-500">
                <span>👁️ {{ article()!.viewCount | number }}</span>
                <span>❤️ {{ article()!.likeCount }}</span>
                <span>💬 {{ article()!.commentCount }}</span>
              </div>
            </div>

            <!-- Content -->
            <div class="prose dark:prose-invert max-w-none">
              <p class="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">{{ article()!.content }}</p>
            </div>

            <!-- Tags -->
            @if (article()!.tags.length > 0) {
              <div class="flex flex-wrap gap-2 mt-6 pt-6 border-t dark:border-gray-700">
                @for (tag of article()!.tags; track tag) {
                  <span class="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-600 dark:text-gray-400">
                    #{{ tag }}
                  </span>
                }
              </div>
            }

            <!-- Actions -->
            <div class="flex items-center gap-4 mt-6 pt-6 border-t dark:border-gray-700">
              <button (click)="toggleLike()" class="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-700">
                {{ article()!.isLiked ? '❤️' : '🤍' }} Like
              </button>
              <button class="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-700">
                🔗 Share
              </button>
            </div>

            <!-- Source -->
            @if (article()!.sourceName) {
              <div class="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p class="text-sm text-gray-500">
                  Source: 
                  @if (article()!.sourceUrl) {
                    <a [href]="article()!.sourceUrl" target="_blank" class="text-blue-600 hover:underline">
                      {{ article()!.sourceName }}
                    </a>
                  } @else {
                    {{ article()!.sourceName }}
                  }
                </p>
              </div>
            }
          </div>
        </article>

        <!-- Related Articles -->
        @if (relatedArticles().length > 0) {
          <div class="mt-8">
            <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Related Articles</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              @for (related of relatedArticles(); track related.id) {
                <a [routerLink]="['/community/news', related.slug]" 
                   class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 hover:shadow-md transition">
                  <h3 class="font-medium text-gray-900 dark:text-white line-clamp-2">{{ related.title }}</h3>
                  <p class="text-sm text-gray-500 mt-2">{{ related.publishedAt | date:'MMM d' }}</p>
                </a>
              }
            </div>
          </div>
        }
      } @else {
        <div class="text-center py-12">
          <p class="text-4xl mb-4">📰</p>
          <p class="text-gray-500">Article not found</p>
          <a routerLink="/community/news" class="text-blue-600 hover:underline mt-4 inline-block">Browse all news</a>
        </div>
      }
    </div>
  `
})
export class NewsDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private newsService = inject(NewsService);

  article = signal<NewsArticle | null>(null);
  relatedArticles = signal<NewsList[]>([]);
  loading = signal(true);

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.newsService.getArticleBySlug(slug).subscribe({
        next: (article: any) => {
          this.article.set(article);
          this.loading.set(false);
          this.loadRelatedArticles(article.id);
        },
        error: (err: any) => this.loading.set(false)
      });
    }
  }

  loadRelatedArticles(articleId: string) {
    this.newsService.getRelatedNews(articleId, 3).subscribe({
      next: (articles: any) => this.relatedArticles.set(articles),
      error: (err: any) => console.error(err)
    });
  }

  toggleLike() {
    const a = this.article();
    if (!a) return;
    (a.isLiked ? this.newsService.unlikeArticle(a.id) : this.newsService.likeArticle(a.id)).subscribe({
      next: () => {},
      error: (err: any) => console.error(err)
    });
  }
}
