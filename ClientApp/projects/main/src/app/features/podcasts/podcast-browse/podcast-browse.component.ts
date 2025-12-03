import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PodcastService, PodcastListItem, PodcastCategoryDto } from '../../../core/services/podcast.service';
import { PodcastLayoutComponent } from '../podcast-layout/podcast-layout.component';
import { PodcastCardComponent } from '../shared/podcast-card/podcast-card.component';

@Component({
  selector: 'app-podcast-browse',
  standalone: true,
  imports: [CommonModule, FormsModule, PodcastLayoutComponent, PodcastCardComponent],
  templateUrl: './podcast-browse.component.html'
    <app-podcast-layout>
      <div class="browse-page">
        <h1>Browse Podcasts</h1>
        
        <!-- Filters -->
        <div class="filters">
          <div class="search-wrapper">
            <input type="text" [(ngModel)]="searchQuery" placeholder="Search podcasts..." 
                   (keyup.enter)="search()" class="search-input" />
            <button (click)="search()" class="search-btn">🔍</button>
          </div>
          <select [(ngModel)]="selectedCategory" (change)="search()">
            <option value="">All Categories</option>
            @for (cat of categories; track cat.name) {
              <option [value]="cat.name">{{ cat.name }} ({{ cat.podcastCount }})</option>
            }
          </select>
          <select [(ngModel)]="sortBy" (change)="search()">
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="subscribers">Most Subscribers</option>
            <option value="newest">Newest</option>
          </select>
        </div>

        <!-- Category Pills -->
        @if (categories.length > 0) {
          <div class="category-pills">
            <button [class.active]="!selectedCategory" (click)="selectCategory('')">All</button>
            @for (cat of categories; track cat.name) {
              <button [class.active]="selectedCategory === cat.name" (click)="selectCategory(cat.name)">
                {{ cat.name }}
              </button>
            }
          </div>
        }

        <!-- Results -->
        <div class="results">
          @if (loading) {
            <div class="loading">
              <div class="spinner"></div>
              <p>Loading podcasts...</p>
            </div>
          } @else if (podcasts.length === 0) {
            <div class="empty">
              <span class="empty-icon">🎙️</span>
              <h3>No podcasts found</h3>
              <p>Try different filters or search terms.</p>
              @if (searchQuery || selectedCategory) {
                <button (click)="clearFilters()" class="btn-clear">Clear Filters</button>
              }
            </div>
          } @else {
            <div class="results-header">
              <span>{{ totalCount }} podcasts found</span>
            </div>
            <div class="podcast-grid">
              @for (podcast of podcasts; track podcast.id) {
                <app-podcast-card [podcast]="podcast" />
              }
            </div>
            @if (hasMore) {
              <button class="load-more" (click)="loadMore()" [disabled]="loadingMore">
                {{ loadingMore ? 'Loading...' : 'Load More' }}
              </button>
            }
          }
        </div>
      </div>
    </app-podcast-layout>
  `,
  styles: [`
    .browse-page h1 { margin-bottom: 1.5rem; }
    .filters { display: flex; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
    .search-wrapper { display: flex; flex: 1; min-width: 200px; }
    .search-input { 
      flex: 1; padding: 0.75rem 1rem; border: 1px solid #ddd; 
      border-radius: 8px 0 0 8px; font-size: 1rem; 
    }
    .search-btn { 
      padding: 0.75rem 1rem; background: #6366f1; color: white; 
      border: none; border-radius: 0 8px 8px 0; cursor: pointer; 
    }
    .filters select { padding: 0.75rem 1rem; border: 1px solid #ddd; border-radius: 8px; font-size: 1rem; }
    
    .category-pills { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
    .category-pills button {
      padding: 0.5rem 1rem; border: 1px solid #ddd; border-radius: 20px;
      background: white; cursor: pointer; font-size: 0.9rem; transition: all 0.2s;
    }
    .category-pills button:hover { border-color: #6366f1; }
    .category-pills button.active { background: #6366f1; color: white; border-color: #6366f1; }
    
    .results-header { margin-bottom: 1rem; color: #666; }
    .podcast-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1.5rem; }
    
    .loading { text-align: center; padding: 4rem; }
    .spinner {
      width: 48px; height: 48px; border: 4px solid #e5e5e5;
      border-top-color: #6366f1; border-radius: 50%;
      animation: spin 1s linear infinite; margin: 0 auto 1rem;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    
    .empty { text-align: center; padding: 4rem; background: #f8f9fa; border-radius: 16px; }
    .empty-icon { font-size: 4rem; display: block; margin-bottom: 1rem; }
    .empty h3 { margin-bottom: 0.5rem; }
    .empty p { color: #666; margin-bottom: 1rem; }
    .btn-clear { padding: 0.75rem 1.5rem; background: #6366f1; color: white; border: none; border-radius: 8px; cursor: pointer; }
    
    .load-more {
      display: block; margin: 2rem auto; padding: 0.75rem 2rem;
      background: #6366f1; color: white; border: none; border-radius: 8px; cursor: pointer;
    }
    .load-more:disabled { opacity: 0.6; cursor: not-allowed; }
  `]
})
export class PodcastBrowseComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private podcastService = inject(PodcastService);

  podcasts: PodcastListItem[] = [];
  categories: PodcastCategoryDto[] = [];
  searchQuery = '';
  selectedCategory = '';
  sortBy = 'popular';
  page = 1;
  totalCount = 0;
  hasMore = false;
  loading = false;
  loadingMore = false;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['q'] || '';
      this.selectedCategory = params['category'] || '';
      this.search();
    });
    this.loadCategories();
  }

  loadCategories() {
    this.podcastService.getCategories().subscribe(cats => {
      if (cats.length > 0) {
        this.categories = cats;
      } else {
        // Fallback to enum-based categories
        this.categories = [
          { name: 'Automotive', podcastCount: 0 },
          { name: 'Classic', podcastCount: 0 },
          { name: 'Electric', podcastCount: 0 },
          { name: 'Racing', podcastCount: 0 },
          { name: 'Maintenance', podcastCount: 0 },
          { name: 'Business', podcastCount: 0 }
        ];
      }
    });
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.search();
  }

  clearFilters() {
    this.searchQuery = '';
    this.selectedCategory = '';
    this.sortBy = 'popular';
    this.search();
  }

  search() {
    this.page = 1;
    this.loading = true;
    this.updateUrl();
    
    this.podcastService.searchPodcasts(this.searchQuery, this.selectedCategory, this.page, 20, this.sortBy)
      .subscribe({
        next: result => {
          this.podcasts = result.items;
          this.totalCount = result.totalCount;
          this.hasMore = result.page < result.totalPages;
          this.loading = false;
        },
        error: () => this.loading = false
      });
  }

  loadMore() {
    if (this.loadingMore) return;
    this.loadingMore = true;
    this.page++;
    
    this.podcastService.searchPodcasts(this.searchQuery, this.selectedCategory, this.page, 20, this.sortBy)
      .subscribe({
        next: result => {
          this.podcasts = [...this.podcasts, ...result.items];
          this.hasMore = result.page < result.totalPages;
          this.loadingMore = false;
        },
        error: () => this.loadingMore = false
      });
  }

  private updateUrl() {
    const queryParams: any = {};
    if (this.searchQuery) queryParams.q = this.searchQuery;
    if (this.selectedCategory) queryParams.category = this.selectedCategory;
    this.router.navigate([], { queryParams, queryParamsHandling: 'merge' });
  }
}
