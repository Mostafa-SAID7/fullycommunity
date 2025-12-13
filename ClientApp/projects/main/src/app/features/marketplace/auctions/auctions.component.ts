import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuctionService, AuctionSearchRequest } from '../../../core/services/commerce/auction.service';
import { Auction } from '../../../core/services/commerce/marketplace.service';

@Component({
  selector: 'app-auctions',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 py-6">
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Auctions</h1>
          <div class="flex gap-2">
            <select [(ngModel)]="filters.status" (change)="search()"
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Scheduled">Upcoming</option>
              <option value="Ended">Ended</option>
            </select>
          </div>
        </div>

        <!-- Ending Soon -->
        @if (endingSoon().length) {
          <section class="mb-8">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Ending Soon
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              @for (auction of endingSoon(); track auction.id) {
                <a [routerLink]="['/marketplace/auction', auction.id]" 
                  class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                  <div class="relative">
                    <img [src]="auction.product.images.length > 0 ? auction.product.images[0].url : 'assets/product-placeholder.png'" 
                      class="w-full h-48 object-cover">
                    <div class="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-xs font-medium rounded flex items-center gap-1">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      {{ getTimeRemaining(auction.endTime) }}
                    </div>
                    <div class="absolute top-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                      {{ auction.bidCount }} bids
                    </div>
                  </div>
                  <div class="p-4">
                    <h3 class="font-medium text-gray-900 dark:text-white line-clamp-2">{{ auction.product.title }}</h3>
                    <div class="mt-2 flex items-baseline justify-between">
                      <div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">Current Bid</div>
                        <div class="text-xl font-bold text-gray-900 dark:text-white">
                          USD {{ auction.currentBid || auction.startingPrice | number:'1.2-2' }}
                        </div>
                      </div>
                      @if (auction.buyItNowPrice) {
                        <div class="text-right">
                          <div class="text-xs text-gray-500 dark:text-gray-400">Buy It Now</div>
                          <div class="text-sm font-medium text-blue-600">USD {{ auction.buyItNowPrice | number:'1.2-2' }}</div>
                        </div>
                      }
                    </div>
                  </div>
                </a>
              }
            </div>
          </section>
        }

        <!-- All Auctions -->
        <section>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">All Auctions</h2>
          @if (loading()) {
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              @for (i of [1,2,3,4,5,6,7,8]; track i) {
                <div class="animate-pulse bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
                  <div class="h-48 bg-gray-200 dark:bg-gray-700"></div>
                  <div class="p-4">
                    <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              }
            </div>
          } @else if (auctions().length) {
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              @for (auction of auctions(); track auction.id) {
                <a [routerLink]="['/marketplace/auction', auction.id]" 
                  class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                  <div class="relative">
                    <img [src]="auction.product.images.length > 0 ? auction.product.images[0].url : 'assets/product-placeholder.png'" 
                      class="w-full h-48 object-cover">
                    <div class="absolute top-2 left-2 px-2 py-1 text-white text-xs font-medium rounded"
                      [class]="auction.status === 'Active' ? 'bg-green-500' : auction.status === 'Scheduled' ? 'bg-blue-500' : 'bg-gray-500'">
                      {{ auction.status }}
                    </div>
                  </div>
                  <div class="p-4">
                    <h3 class="font-medium text-gray-900 dark:text-white line-clamp-2">{{ auction.product.title }}</h3>
                    <div class="mt-2">
                      <div class="text-sm text-gray-500 dark:text-gray-400">
                        {{ auction.status === 'Active' ? 'Current Bid' : auction.status === 'Scheduled' ? 'Starting Price' : 'Final Price' }}
                      </div>
                      <div class="text-lg font-bold text-gray-900 dark:text-white">
                        USD {{ auction.currentBid || auction.startingPrice | number:'1.2-2' }}
                      </div>
                    </div>
                    <div class="flex items-center justify-between mt-2 text-sm text-gray-500 dark:text-gray-400">
                      <span>{{ auction.bidCount }} bids</span>
                      @if (auction.status === 'Active') {
                        <span class="text-red-500">{{ getTimeRemaining(auction.endTime) }}</span>
                      }
                    </div>
                  </div>
                </a>
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
              <svg class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No auctions found</h3>
              <p class="text-gray-500 dark:text-gray-400">Check back later for new auctions</p>
            </div>
          }
        </section>
      </div>
    </div>
  `
})
export class AuctionsComponent implements OnInit {
  private auctionService = inject(AuctionService);

  auctions = signal<Auction[]>([]);
  endingSoon = signal<Auction[]>([]);
  loading = signal(true);
  loadingMore = signal(false);
  hasMore = signal(true);

  filters: AuctionSearchRequest = { page: 1, pageSize: 20 };

  ngOnInit() {
    this.loadEndingSoon();
    this.search();
  }

  loadEndingSoon() {
    this.auctionService.getEndingSoon(6).subscribe(auctions => this.endingSoon.set(auctions));
  }

  search() {
    this.loading.set(true);
    this.filters.page = 1;
    this.auctionService.searchAuctions(this.filters).subscribe({
      next: (result) => {
        this.auctions.set(result.items);
        this.hasMore.set(result.page < result.totalPages);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  loadMore() {
    this.loadingMore.set(true);
    this.filters.page = (this.filters.page || 1) + 1;
    this.auctionService.searchAuctions(this.filters).subscribe({
      next: (result) => {
        this.auctions.update(a => [...a, ...result.items]);
        this.hasMore.set(result.page < result.totalPages);
        this.loadingMore.set(false);
      },
      error: () => this.loadingMore.set(false)
    });
  }

  getTimeRemaining(endTime: string): string {
    const end = new Date(endTime).getTime();
    const now = Date.now();
    const diff = end - now;

    if (diff <= 0) return 'Ended';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  }
}
