import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NewsService, NewsListItem, NewsCategory } from '../../../core/services/news.service';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 py-6">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Auto News</h1>
          <p class="mt-2 text-gray-600 dark:text-gray-400">Latest news from the automotive world</p>
        </div>
      </div>

      <!-- Breaking News Banner -->
      @if (breakingNews().length > 0) {
        <div class="bg-red-600 text-white rounded-xl p-4 mb-6">
          <div class="flex items-center gap-3">
            <span class="px-2 py-1 bg-white text-red-600 text-xs font-bold rounded animate-pulse">BREAKING</span>
            <div class="overflow-hidden flex-1">
              <a [routerLink]="['/community/news', breakingNews()[0].slug]" class="hover:underline">
                {{ breakingNews()[0].title }}
              </a>
            </div>
          </div>
        </div>
      }

      <!-- Categories -->
      <div class="flex gap-2 overflow-x-auto pb-4 mb-6">
        <button (click)="selectedCategory = ''; loadArticles()"
                [class]="!selectedCategory ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'"
                class="px-4 py-2 rounded-full whitespace-nowrap transition">
          All
        </button>
        @for (category of categories(); track category.id) {
          <button (click)="selectedCategory = category.id; loadArticles()"
                  [class]="selectedCategory === category.id ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'"
                  class="px-4 py-2 rounded-full whitespace-nowrap transition">
            {{ category.name }}
          </button>
        }
      </div>

      <!-- Featured Articles -->
      @if (featuredArticles().length > 0) {
        <div class="mb-8">
          <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Featured Stories</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (article of featuredArticles(); track article.id; let i = $index) {
              <div [class]="i === 0 ? 'md:col-span-2 md:row-span-2' : ''"
                   class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition cursor-pointer"
                   [routerLink]="['/community/news', article.slug]">
                <div [class]="i === 0 ? 'h-64' : 'h-40'" 
                     class="bg-gradient-to-br from-blue-500 to-purple-600 relative">
                  @if (article.coverImageUrl) {
                    <img [src]="article.coverImageUrl" [alt]="article.title" class="w-full h-full object-cover">
                  }
                  @if (article.isBreaking) {
                    <span class="absolute top-3 left-3 px-2 py-1 bg-red-600 text-white text-xs font-bold rounded">
                      BREAKING
                    </span>
                  }
                </div>
                <div class="p-4">
                  @if (article.category) {
                    <span class="text-xs text-blue-600 dark:text-blue-400 font-medium">
                      {{ article.category.name }}
                    </span>
                  }
                  <h3 [class]="i === 0 ? 'text-xl' : 'text-base'" 
                      class="font-semibold text-gray-900 dark:text-white mt-1 line-clamp-2">
                    {{ article.title }}
                  </h3>
                  @if (i === 0 && article.excerpt) {
                    <p class="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">{{ article.excerpt }}</p>
                  }
                  <div class="flex items-center justify-between mt-3 text-sm text-gray-500">
                    <span>{{ article.publishedAt | date:'MMM d, yyyy' }}</span>
                    <span>👁️ {{ article.viewCount | number }}</span>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      }

      <!-- Search -->
      <div class="flex gap-4 mb-6">
        <input type="text" [(ngModel)]="searchTerm" (keyup.enter)="loadArticles()" placeholder="Search news..."
               class="px-4 py-2 border rounded-lg flex-1 dark:bg-gray-800 dark:border-gray-700">
        <select [(ngModel)]="sortBy" (change)="loadArticles()" 
                class="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700">
          <option value="newest">Newest</option>
          <option value="popular">Most Popular</option>
          <option value="trending">Trending</option>
        </select>
      </div>

      <!-- All Articles -->
      <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Latest News</h2>
      @if (loading()) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (article of articles(); track article.id) {
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition cursor-pointer"
                 [routerLink]="['/community/news', article.slug]">
              <div class="h-40 bg-gradient-to-br from-gray-400 to-gray-600 relative">
                @if (article.coverImageUrl) {
                  <img [src]="article.coverImageUrl" [alt]="article.title" class="w-full h-full object-cover">
                }
              </div>
              <div class="p-4">
                @if (article.category) {
                  <span class="text-xs text-blue-600 dark:text-blue-400 font-medium">
                    {{ article.category.name }}
                  </span>
                }
                <h3 class="font-semibold text-gray-900 dark:text-white mt-1 line-clamp-2">{{ article.title }}</h3>
                @if (article.excerpt) {
                  <p class="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">{{ article.excerpt }}</p>
                }
                <div class="flex items-center justify-between mt-3 text-sm text-gray-500">
                  <span>{{ article.publishedAt | date:'MMM d' }}</span>
                  <div class="flex gap-3">
                    <span>👁️ {{ article.viewCount | number }}</span>
                    <span>❤️ {{ article.likeCount }}</span>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      }

      @if (articles().length === 0 && !loading()) {
        <div class="text-center py-12 text-gray-500">
          <p class="text-4xl mb-4">📰</p>
          <p>No news articles found.</p>
        </div>
      }
    </div>
  `
})
export class NewsComponent implements OnInit {
  private newsService = inject(NewsService);

  articles = signal<NewsListItem[]>([]);
  featuredArticles = signal<NewsListItem[]>([]);
  breakingNews = signal<NewsListItem[]>([]);
  categories = signal<NewsCategory[]>([]);
  loading = signal(false);
  
  selectedCategory = '';
  searchTerm = '';
  sortBy = 'newest';

  ngOnInit() {
    this.loadArticles();
    this.loadFeaturedArticles();
    this.loadBreakingNews();
    this.loadCategories();
  }

  loadArticles() {
    this.loading.set(true);
    this.newsService.getArticles({
      categoryId: this.selectedCategory || undefined,
      searchTerm: this.searchTerm || undefined,
      sortBy: this.sortBy
    }).subscribe({
      next: (result) => {
        this.articles.set(result.items);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  loadFeaturedArticles() {
    this.newsService.getFeaturedArticles(4).subscribe({
      next: (articles) => this.featuredArticles.set(articles)
    });
  }

  loadBreakingNews() {
    this.newsService.getBreakingNews(1).subscribe({
      next: (articles) => this.breakingNews.set(articles)
    });
  }

  loadCategories() {
    this.newsService.getCategories().subscribe({
      next: (categories) => this.categories.set(categories)
    });
  }
}
