import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { MarketplaceService, Product, MarketplaceCategory } from '../../../core/services/commerce/marketplace.service';
import { ProductCardComponent } from '../shared/product-card.component';

@Component({
  selector: 'app-product-category',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 py-6">
        <nav class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
          <a routerLink="/marketplace" class="hover:text-gray-700 dark:hover:text-gray-300">Marketplace</a>
          <span>/</span>
          <span class="text-gray-900 dark:text-white">{{ categoryName }}</span>
        </nav>

        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">{{ categoryName }}</h1>

        @if (loading()) {
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            @for (i of [1,2,3,4,5,6,7,8,9,10]; track i) {
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
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            @for (product of products(); track product.id) {
              <app-product-card [product]="product" />
            }
          </div>

          @if (hasMore()) {
            <div class="text-center mt-8">
              <button (click)="loadMore()" [disabled]="loadingMore()"
                class="px-6 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50">
                {{ loadingMore() ? 'Loading...' : 'Load More' }}
              </button>
            </div>
          }
        } @else {
          <div class="text-center py-16">
            <p class="text-gray-500 dark:text-gray-400">No products found in this category</p>
          </div>
        }
      </div>
    </div>
  `
})
export class ProductCategoryComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private marketplaceService = inject(MarketplaceService);

  products = signal<Product[]>([]);
  loading = signal(true);
  loadingMore = signal(false);
  hasMore = signal(true);
  
  category: MarketplaceCategory = 'PartsServicing';
  categoryName = '';
  page = 1;

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.category = params['category'] as MarketplaceCategory;
      this.categoryName = this.category.replace(/([A-Z])/g, ' $1').trim();
      this.loadProducts();
    });
  }

  loadProducts() {
    this.loading.set(true);
    this.page = 1;
    this.marketplaceService.getProductsByCategory(this.category, 1, 20).subscribe({
      next: (result) => {
        this.products.set(result.items);
        this.hasMore.set(result.page < result.totalPages);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  loadMore() {
    this.loadingMore.set(true);
    this.page++;
    this.marketplaceService.getProductsByCategory(this.category, this.page, 20).subscribe({
      next: (result) => {
        this.products.update(p => [...p, ...result.items]);
        this.hasMore.set(result.page < result.totalPages);
        this.loadingMore.set(false);
      },
      error: () => this.loadingMore.set(false)
    });
  }
}
