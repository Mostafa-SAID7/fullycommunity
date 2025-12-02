import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { MarketplaceService, Seller, Product } from '../../../core/services/marketplace.service';
import { ProductCardComponent } from '../shared/product-card.component';

@Component({
  selector: 'app-seller-store',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      @if (loading()) {
        <div class="animate-pulse">
          <div class="h-48 bg-gray-200 dark:bg-gray-700"></div>
          <div class="max-w-7xl mx-auto px-4 -mt-16">
            <div class="flex items-end gap-4">
              <div class="w-32 h-32 rounded-full bg-gray-300 dark:bg-gray-600 border-4 border-white dark:border-gray-900"></div>
            </div>
          </div>
        </div>
      } @else if (seller()) {
        <!-- Banner -->
        <div class="h-48 bg-gradient-to-r from-blue-600 to-purple-600">
          @if (seller()!.bannerUrl) {
            <img [src]="seller()!.bannerUrl" class="w-full h-full object-cover">
          }
        </div>

        <div class="max-w-7xl mx-auto px-4">
          <div class="flex flex-col md:flex-row md:items-end gap-4 -mt-16 relative z-10">
            <img [src]="seller()!.logoUrl || 'assets/store-placeholder.png'" 
              class="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-900 bg-gray-200">
            
            <div class="flex-1 pb-4">
              <div class="flex items-center gap-2">
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ seller()!.storeName }}</h1>
                @if (seller()!.isVerified) {
                  <svg class="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                }
              </div>
              <div class="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                <span class="flex items-center gap-1">
                  <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  {{ seller()!.rating.toFixed(1) }} ({{ seller()!.reviewCount }} reviews)
                </span>
                <span>{{ seller()!.totalSales }} sales</span>
                <span>{{ seller()!.totalProducts }} products</span>
              </div>
            </div>
          </div>

          @if (seller()!.description) {
            <p class="text-gray-700 dark:text-gray-300 mt-4 max-w-3xl">{{ seller()!.description }}</p>
          }

          <!-- Products -->
          <div class="mt-8">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6">Products</h2>
            @if (products().length) {
              <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                @for (product of products(); track product.id) {
                  <app-product-card [product]="product" />
                }
              </div>
              @if (hasMore()) {
                <div class="text-center mt-8">
                  <button (click)="loadMore()" class="px-6 py-2 bg-white dark:bg-gray-800 rounded-lg">Load More</button>
                </div>
              }
            } @else {
              <p class="text-gray-500 dark:text-gray-400 text-center py-8">No products listed yet</p>
            }
          </div>
        </div>
      }
    </div>
  `
})
export class SellerStoreComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private marketplaceService = inject(MarketplaceService);

  seller = signal<Seller | null>(null);
  products = signal<Product[]>([]);
  loading = signal(true);
  hasMore = signal(true);
  page = 1;

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.loadSeller(params['slug']);
    });
  }

  loadSeller(slug: string) {
    this.loading.set(true);
    this.marketplaceService.getSellerBySlug(slug).subscribe({
      next: (seller) => {
        this.seller.set(seller);
        this.loading.set(false);
        this.loadProducts(seller.id);
      },
      error: () => this.loading.set(false)
    });
  }

  loadProducts(sellerId: string) {
    this.page = 1;
    this.marketplaceService.getSellerProducts(sellerId, 1, 20).subscribe(result => {
      this.products.set(result.items);
      this.hasMore.set(result.page < result.totalPages);
    });
  }

  loadMore() {
    if (!this.seller()) return;
    this.page++;
    this.marketplaceService.getSellerProducts(this.seller()!.id, this.page, 20).subscribe(result => {
      this.products.update(p => [...p, ...result.items]);
      this.hasMore.set(result.page < result.totalPages);
    });
  }
}
