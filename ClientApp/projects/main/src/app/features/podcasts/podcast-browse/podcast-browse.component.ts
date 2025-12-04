import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PodcastService, PodcastListItem, PodcastCategoryDto } from '../../../core/services/podcast.service';
import { PodcastLayoutComponent } from '../podcast-layout/podcast-layout.component';
import { PodcastCardComponent } from '../shared/podcast-card/podcast-card.component';
import { 
  SearchInputComponent, 
  SelectComponent, 
  ChipComponent, 
  ButtonComponent,
  SpinnerComponent 
} from '../../../shared/ui';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { LocalizationService } from '../../../core/services/localization.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-podcast-browse',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    PodcastLayoutComponent, 
    PodcastCardComponent,
    SearchInputComponent,
    SelectComponent,
    ChipComponent,
    ButtonComponent,
    SpinnerComponent,
    TranslatePipe
  ],
  templateUrl: './podcast-browse.component.html'
})
export class PodcastBrowseComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private podcastService = inject(PodcastService);
  private localization = inject(LocalizationService);
  private toastService = inject(ToastService);

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

  // UI Component Options
  get categoryOptions() {
    return [
      { label: this.localization.t('podcasts.allCategories'), value: '' },
      ...this.categories.map(cat => ({
        label: `${cat.name} (${cat.podcastCount})`,
        value: cat.name
      }))
    ];
  }

  get sortOptions() {
    return [
      { label: this.localization.t('podcasts.mostPopular'), value: 'popular' },
      { label: this.localization.t('podcasts.highestRated'), value: 'rating' },
      { label: this.localization.t('podcasts.mostSubscribers'), value: 'subscribers' },
      { label: this.localization.t('podcasts.newest'), value: 'newest' }
    ];
  }

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
    this.toastService.info(
      this.localization.t('podcasts.clearFilters'),
      this.localization.t('notifications.info')
    );
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
        error: (error) => {
          this.loading = false;
          this.toastService.error(
            this.localization.t('errors.networkError'),
            this.localization.t('errors.error')
          );
        }
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
        error: (error) => {
          this.loadingMore = false;
          this.toastService.error(
            this.localization.t('errors.networkError'),
            this.localization.t('errors.error')
          );
        }
      });
  }

  trackByPodcastId(index: number, podcast: PodcastListItem): string {
    return podcast.id;
  }

  trackByCategoryName(index: number, category: PodcastCategoryDto): string {
    return category.name;
  }

  private updateUrl() {
    const queryParams: any = {};
    if (this.searchQuery) queryParams.q = this.searchQuery;
    if (this.selectedCategory) queryParams.category = this.selectedCategory;
    this.router.navigate([], { queryParams, queryParamsHandling: 'merge' });
  }
}
