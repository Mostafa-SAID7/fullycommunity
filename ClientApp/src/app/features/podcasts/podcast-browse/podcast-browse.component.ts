import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PodcastService, Podcast } from '../../../core/services/podcast.service';
import { PodcastLayoutComponent } from '../shared/podcast-layout/podcast-layout.component';
import { PodcastCardComponent } from '../shared/podcast-card/podcast-card.component';

@Component({
  selector: 'app-podcast-browse',
  standalone: true,
  imports: [CommonModule, FormsModule, PodcastLayoutComponent, PodcastCardComponent],
  template: `
    <app-podcast-layout>
      <div class="browse-page">
        <h1>Browse Podcasts</h1>
        
        <!-- Filters -->
        <div class="filters">
          <input type="text" [(ngModel)]="searchQuery" placeholder="Search..." (keyup.enter)="search()" />
          <select [(ngModel)]="selectedCategory" (change)="search()">
            <option value="">All Categories</option>
            @for (cat of categories; track cat.id) {
              <option [value]="cat.name">{{ cat.name }}</option>
            }
          </select>
          <select [(ngModel)]="sortBy" (change)="search()">
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="subscribers">Most Subscribers</option>
            <option value="newest">Newest</option>
          </select>
        </div>

        <!-- Results -->
        <div class="results">
          @if (loading) {
            <div class="loading">Loading...</div>
          } @else if (podcasts.length === 0) {
            <div class="empty">No podcasts found. Try different filters.</div>
          } @else {
            <div class="podcast-grid">
              @for (podcast of podcasts; track podcast.id) {
                <app-podcast-card [podcast]="podcast" />
              }
            </div>
            @if (hasMore) {
              <button class="load-more" (click)="loadMore()">Load More</button>
            }
          }
        </div>
      </div>
    </app-podcast-layout>
  `,
  styles: [`
    .browse-page h1 { margin-bottom: 1.5rem; }
    .filters { display: flex; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap; }
    .filters input, .filters select {
      padding: 0.75rem 1rem; border: 1px solid #ddd; border-radius: 8px; font-size: 1rem;
    }
    .filters input { flex: 1; min-width: 200px; }
    .podcast-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1.5rem; }
    .loading, .empty { text-align: center; padding: 3rem; color: #666; }
    .load-more {
      display: block; margin: 2rem auto; padding: 0.75rem 2rem;
      background: #6366f1; color: white; border: none; border-radius: 8px; cursor: pointer;
    }
  `]
})
export class PodcastBrowseComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private podcastService = inject(PodcastService);

  podcasts: Podcast[] = [];
  categories: any[] = [];
  searchQuery = '';
  selectedCategory = '';
  sortBy = 'popular';
  page = 1;
  hasMore = false;
  loading = false;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['q'] || '';
      this.selectedCategory = params['category'] || '';
      this.search();
    });
    this.loadCategories();
  }

  loadCategories() {
    this.podcastService.getCategories().subscribe(cats => this.categories = cats);
  }

  search() {
    this.page = 1;
    this.loading = true;
    this.podcastService.searchPodcasts(this.searchQuery, this.selectedCategory, this.page, 20)
      .subscribe(result => {
        this.podcasts = result.items;
        this.hasMore = result.page < result.totalPages;
        this.loading = false;
      });
  }

  loadMore() {
    this.page++;
    this.podcastService.searchPodcasts(this.searchQuery, this.selectedCategory, this.page, 20)
      .subscribe(result => {
        this.podcasts = [...this.podcasts, ...result.items];
        this.hasMore = result.page < result.totalPages;
      });
  }
}
