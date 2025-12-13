import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MarketplaceService, Product, ProductSearchRequest, ProductCondition, MarketplaceCategory } from '../../../core/services/commerce/marketplace.service';
import { ProductCardComponent } from '../shared/product-card.component';

@Component({
  selector: 'app-product-search',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 py-6">
        <div class="flex gap-6">
          <!-- Filters Sidebar -->
          <div class="hidden lg:block w-64 flex-shrink-0">
            <div class="bg-white dark:bg-gray-800 rounded-xl p-4 sticky top-4">
              <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Filters</h3>
              
              <!-- Category -->
              <div class="mb-6">
                <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</h4>
                <select [(ngModel)]="filters.category" (change)="applyFilters()"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
                  <option value="">All Categories</option>
                  @for (cat of categories; track cat) {
                    <option [value]="cat">{{ cat }}</option>
                  }
                </select>
              </div>

              <!-- Condition -->
              <div class="mb-6">
                <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Condition</h4>
                <div class="space-y-2">
                  @for (cond of conditions; track cond) {
                    <label class="flex items-center gap-2">
                      <input type="radio" name="condition" [value]="cond" [(ngModel)]="filters.condition" (change)="applyFilters()"
                        class="text-blue-600">
                      <span class="text-sm text-gray-700 dark:text-gray-300">{{ cond }}</span>
                    </label>
                  }
                </div>
              </div>

              <!-- Price Range -->
              <div class="mb-6">
                <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price Range</h4>
                <div class="flex gap-2">
                  <input type="number" [(ngModel)]="filters.minPrice" placeholder="Min" (blur)="applyFilters()"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
                  <input type="number" [(ngModel)]="filters.maxPrice" placeholder="Max" (blur)="applyFilters()"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
                </div>
              </div>

              <!-- Shipping -->
              <div class="mb-6">
                <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Shipping</h4>
                <label class="flex items-center gap-2">
                  <input type="checkbox" [(ngModel)]="filters.freeShipping" (change)="applyFilters()" class="rounded text-blue-600">
                  <span class="text-sm text-gray-700 dark:text-gray-300">Free Shipping</span>
                </label>
                <label class="flex items-center gap-2 mt-2">
                  <input type="checkbox" [(ngModel)]="filters.localPickup" (change)="applyFilters()" class="rounded text-blue-600">
                  <span class="text-sm text-gray-700 dark:text-gray-300">Local Pickup</span>
                </label>
              </div>

              <button (click)="clearFilters()" class="w-full px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                Clear All Filters
              </button>
            </div>
          </div>

          <!-- Main Content -->
          <div class="flex-1">
            <!-- Search Bar & Sort -->
            <div class="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6">
              <div class="flex flex-col sm:flex-row gap-4">
                <div class="flex-1 relative">
                  <input type="text" [(ngModel)]="filters.query" (keyup.enter)="applyFilters()"
                    placeholder="Search products..."
                    class="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <svg class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                </div>
                <select [(ngModel)]="filters.sortBy" (change)="applyFilters()"
                  class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option value="Relevance">Relevance</option>
                  <option value="PriceLow">Price: Low to High</option>
                  <option value="PriceHigh">Price: High to Low</option>
                  <option value="Newest">Newest First</option>
                  <option value="BestSelling">Best Selling</option>
                  <option value="Rating">Highest Rated</option>
                </select>
              </div>
            </div>

            <!-- Results Count -->
            <div class="flex items-center justify-between mb-4">
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ totalCount() }} results found
              </p>
              <button (click)="showFilters.set(!showFilters())" class="lg:hidden px-4 py-2 bg-white dark:bg-gray-800 rounded-lg text-sm">
                Filters
              </button>
            </div>

            <!-- Products Grid -->
            @if (loading()) {
              <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                @for (i of [1,2,3,4,5,6,7,8]; track i) {
                  <div class="animate-pulse bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
                    <div class="aspect-square bg-gray-200 dark:bg-gray-700"></div>
                    <div class="p-4">
                      <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                      <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                  </div>
                }
              </div>
            } @else if (products().length) {
              <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                @for (product of products(); track product.id) {
                  <app-product-card [product]="product" />
                }
              </div>

              <!-- Pagination -->
              @if (totalPages() > 1) {
                <div class="flex justify-center gap-2 mt-8">
                  <button (click)="goToPage(currentPage() - 1)" [disabled]="currentPage() === 1"
                    class="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg disabled:opacity-50">
                    Previous
                  </button>
                  @for (page of getPageNumbers(); track page) {
                    <button (click)="goToPage(page)"
                      [class]="page === currentPage() ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'"
                      class="px-4 py-2 rounded-lg">
                      {{ page }}
                    </button>
                  }
                  <button (click)="goToPage(currentPage() + 1)" [disabled]="currentPage() === totalPages()"
                    class="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg disabled:opacity-50">
                    Next
                  </button>
                </div>
              }
            } @else {
              <div class="text-center py-16">
                <svg class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No products found</h3>
                <p class="text-gray-500 dark:text-gray-400">Try adjusting your search or filters</p>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProductSearchComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private marketplaceService = inject(MarketplaceService);

  products = signal<Product[]>([]);
  totalCount = signal(0);
  currentPage = signal(1);
  totalPages = signal(1);
  loading = signal(true);
  showFilters = signal(false);

  filters: ProductSearchRequest = {
    query: '',
    category: undefined,
    condition: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    freeShipping: undefined,
    localPickup: undefined,
    sortBy: 'Relevance',
    page: 1,
    pageSize: 20
  };

  categories: MarketplaceCategory[] = [
    'PartsServicing', 'AccessoriesAutomobilia', 'TyresWheels', 'CarCareProducts',
    'Tools', 'CarCovers', 'BooksDVD', 'LifestyleAttire'
  ];

  conditions: ProductCondition[] = ['New', 'LikeNew', 'Excellent', 'Good', 'Fair', 'ForParts', 'Refurbished'];

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.filters.query = params['query'] || '';
      this.filters.category = params['category'] as MarketplaceCategory || undefined;
      this.filters.sortBy = params['sortBy'] || 'Relevance';
      this.search();
    });
  }

  search() {
    this.loading.set(true);
    this.marketplaceService.searchProducts(this.filters).subscribe({
      next: (result) => {
        this.products.set(result.items);
        this.totalCount.set(result.totalCount);
        this.currentPage.set(result.page);
        this.totalPages.set(result.totalPages);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  applyFilters() {
    this.filters.page = 1;
    this.search();
  }

  clearFilters() {
    this.filters = {
      query: this.filters.query,
      sortBy: 'Relevance',
      page: 1,
      pageSize: 20
    };
    this.search();
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    this.filters.page = page;
    this.search();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const current = this.currentPage();
    const total = this.totalPages();

    let start = Math.max(1, current - 2);
    let end = Math.min(total, current + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }
}
