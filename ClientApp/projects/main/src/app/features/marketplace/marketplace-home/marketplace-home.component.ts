import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MarketplaceService, Product, Seller, MarketplaceCategory } from '../../../core/services/marketplace.service';
import { AuctionService, Auction } from '../../../core/services/auction.service';
import { ProductCardComponent } from '../shared/product-card.component';

@Component({
  selector: 'app-marketplace-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ProductCardComponent],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      <!-- Hero Section -->
      <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div class="max-w-7xl mx-auto px-4 py-12">
          <div class="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h1 class="text-4xl font-bold mb-4">Car Parts & Accessories Marketplace</h1>
              <p class="text-xl text-blue-100 mb-6">Find parts, accessories, and everything for your classic car</p>
              <div class="flex gap-4">
                <a routerLink="/marketplace/search" class="px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100">
                  Browse All
                </a>
                <a routerLink="/marketplace/sell" class="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-400 border border-blue-400">
                  Start Selling
                </a>
              </div>
            </div>
            <div class="w-full md:w-96">
              <div class="relative">
                <input type="text" [(ngModel)]="searchQuery" (keyup.enter)="search()"
                  placeholder="Search parts, accessories..."
                  class="w-full px-4 py-3 pl-12 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-300">
                <svg class="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 py-8">
        <!-- Categories -->
        <section class="mb-12">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Shop by Category</h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            @for (cat of categories; track cat.id) {
              <a [routerLink]="['/marketplace/category', cat.id]" 
                class="bg-white dark:bg-gray-800 rounded-xl p-4 text-center hover:shadow-lg transition-shadow group">
                <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-800">
                  <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="cat.icon"/>
                  </svg>
                </div>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ cat.name }}</span>
              </a>
            }
          </div>
        </section>

        <!-- Featured Products -->
        <section class="mb-12">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Featured Products</h2>
            <a routerLink="/marketplace/search" [queryParams]="{featured: true}" class="text-blue-600 hover:underline">View All</a>
          </div>
          @if (loadingFeatured()) {
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              @for (i of [1,2,3,4,5]; track i) {
                <div class="animate-pulse bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
                  <div class="aspect-square bg-gray-200 dark:bg-gray-700"></div>
                  <div class="p-4">
                    <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              }
            </div>
          } @else {
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              @for (product of featuredProducts(); track product.id) {
                <app-product-card [product]="product" (cartAdded)="onCartAdded($event)" />
              }
            </div>
          }
        </section>

        <!-- Auctions Ending Soon -->
        <section class="mb-12">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Auctions Ending Soon
            </h2>
            <a routerLink="/marketplace/auctions" class="text-blue-600 hover:underline">View All Auctions</a>
          </div>
          @if (loadingAuctions()) {
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              @for (i of [1,2,3]; track i) {
                <div class="animate-pulse bg-white dark:bg-gray-800 rounded-xl p-4">
                  <div class="flex gap-4">
                    <div class="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div class="flex-1">
                      <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                      <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              }
            </div>
          } @else {
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              @for (auction of endingSoonAuctions(); track auction.id) {
                <a [routerLink]="['/marketplace/auction', auction.id]" 
                  class="bg-white dark:bg-gray-800 rounded-xl p-4 hover:shadow-lg transition-shadow flex gap-4">
                  <img [src]="auction.product.images[0]?.url || 'assets/product-placeholder.png'" 
                    class="w-24 h-24 rounded-lg object-cover">
                  <div class="flex-1 min-w-0">
                    <h3 class="font-medium text-gray-900 dark:text-white line-clamp-2">{{ auction.product.title }}</h3>
                    <div class="mt-2">
                      <div class="text-sm text-gray-500 dark:text-gray-400">Current Bid</div>
                      <div class="text-lg font-bold text-gray-900 dark:text-white">
                        {{ auction.product.currency }} {{ auction.currentBid || auction.startingPrice | number:'1.2-2' }}
                      </div>
                    </div>
                    <div class="flex items-center gap-2 mt-2 text-sm text-red-500">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      {{ getTimeRemaining(auction.endTime) }}
                    </div>
                  </div>
                </a>
              }
            </div>
          }
        </section>

        <!-- Recent Products -->
        <section class="mb-12">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Recently Listed</h2>
            <a routerLink="/marketplace/search" [queryParams]="{sortBy: 'Newest'}" class="text-blue-600 hover:underline">View All</a>
          </div>
          @if (loadingRecent()) {
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              @for (i of [1,2,3,4,5]; track i) {
                <div class="animate-pulse bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
                  <div class="aspect-square bg-gray-200 dark:bg-gray-700"></div>
                  <div class="p-4">
                    <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              }
            </div>
          } @else {
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              @for (product of recentProducts(); track product.id) {
                <app-product-card [product]="product" (cartAdded)="onCartAdded($event)" />
              }
            </div>
          }
        </section>

        <!-- Top Sellers -->
        <section>
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Top Sellers</h2>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            @for (seller of topSellers(); track seller.id) {
              <a [routerLink]="['/marketplace/seller', seller.slug || seller.id]" 
                class="bg-white dark:bg-gray-800 rounded-xl p-4 text-center hover:shadow-lg transition-shadow">
                <img [src]="seller.logoUrl || 'assets/store-placeholder.png'" 
                  class="w-16 h-16 mx-auto rounded-full object-cover mb-3">
                <h3 class="font-medium text-gray-900 dark:text-white truncate">{{ seller.storeName }}</h3>
                <div class="flex items-center justify-center gap-1 mt-1">
                  <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  <span class="text-sm text-gray-600 dark:text-gray-400">{{ seller.rating.toFixed(1) }}</span>
                </div>
                <span class="text-xs text-gray-500 dark:text-gray-400">{{ seller.totalSales }} sales</span>
              </a>
            }
          </div>
        </section>
      </div>
    </div>
  `
})
export class MarketplaceHomeComponent implements OnInit {
  private marketplaceService = inject(MarketplaceService);
  private auctionService = inject(AuctionService);

  featuredProducts = signal<Product[]>([]);
  recentProducts = signal<Product[]>([]);
  endingSoonAuctions = signal<Auction[]>([]);
  topSellers = signal<Seller[]>([]);
  
  loadingFeatured = signal(true);
  loadingRecent = signal(true);
  loadingAuctions = signal(true);
  
  searchQuery = '';

  categories = [
    { id: 'PartsServicing', name: 'Parts & Servicing', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
    { id: 'AccessoriesAutomobilia', name: 'Accessories', icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' },
    { id: 'TyresWheels', name: 'Tyres & Wheels', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'CarCareProducts', name: 'Car Care', icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01' },
    { id: 'Tools', name: 'Tools', icon: 'M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z' },
    { id: 'Auctions', name: 'Auctions', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' }
  ];

  ngOnInit() {
    this.loadFeatured();
    this.loadRecent();
    this.loadAuctions();
    this.loadTopSellers();
  }

  loadFeatured() {
    this.marketplaceService.getFeaturedProducts(10).subscribe({
      next: (products) => {
        this.featuredProducts.set(products);
        this.loadingFeatured.set(false);
      },
      error: () => this.loadingFeatured.set(false)
    });
  }

  loadRecent() {
    this.marketplaceService.getRecentProducts(10).subscribe({
      next: (products) => {
        this.recentProducts.set(products);
        this.loadingRecent.set(false);
      },
      error: () => this.loadingRecent.set(false)
    });
  }

  loadAuctions() {
    this.auctionService.getEndingSoon(6).subscribe({
      next: (auctions) => {
        this.endingSoonAuctions.set(auctions);
        this.loadingAuctions.set(false);
      },
      error: () => this.loadingAuctions.set(false)
    });
  }

  loadTopSellers() {
    this.marketplaceService.getTopSellers(6).subscribe(sellers => this.topSellers.set(sellers));
  }

  search() {
    if (this.searchQuery.trim()) {
      window.location.href = `/marketplace/search?query=${encodeURIComponent(this.searchQuery)}`;
    }
  }

  onCartAdded(product: Product) {
    // Show toast notification
    console.log('Added to cart:', product.title);
  }

  getTimeRemaining(endTime: string): string {
    const end = new Date(endTime).getTime();
    const now = Date.now();
    const diff = end - now;
    
    if (diff <= 0) return 'Ended';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) return `${Math.floor(hours / 24)}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  }
}
