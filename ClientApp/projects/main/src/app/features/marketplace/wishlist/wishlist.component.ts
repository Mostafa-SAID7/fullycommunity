import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MarketplaceService, WishlistItem } from '../../../core/services/commerce/marketplace.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div class="max-w-6xl mx-auto px-4 py-8">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Wishlist</h1>

        @if (loading()) {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            @for (i of [1,2,3,4,5,6]; track i) {
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
        } @else if (items().length) {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            @for (item of items(); track item.id) {
              <div class="bg-white dark:bg-gray-800 rounded-xl p-4">
                <div class="flex gap-4">
                  <a [routerLink]="['/marketplace/product', item.productId]">
                    <img [src]="item.product.images[0].url || 'assets/product-placeholder.png'" 
                      class="w-24 h-24 rounded-lg object-cover">
                  </a>
                  <div class="flex-1 min-w-0">
                    <a [routerLink]="['/marketplace/product', item.productId]" 
                      class="font-medium text-gray-900 dark:text-white hover:text-blue-600 line-clamp-2">
                      {{ item.product.title }}
                    </a>
                    <div class="text-lg font-bold text-gray-900 dark:text-white mt-1">
                      {{ item.product.currency }} {{ item.product.price | number:'1.2-2' }}
                    </div>
                    <div class="flex gap-2 mt-2">
                      <button (click)="moveToCart(item)" 
                        class="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                        Add to Cart
                      </button>
                      <button (click)="remove(item)" 
                        class="px-3 py-1 text-red-600 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 rounded">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        } @else {
          <div class="text-center py-16">
            <svg class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Your wishlist is empty</h2>
            <p class="text-gray-500 dark:text-gray-400 mb-6">Save items you like to your wishlist</p>
            <a routerLink="/marketplace" class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Browse Products
            </a>
          </div>
        }
      </div>
    </div>
  `
})
export class WishlistComponent implements OnInit {
  private marketplaceService = inject(MarketplaceService);

  items = signal<WishlistItem[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.loadWishlist();
  }

  loadWishlist() {
    this.marketplaceService.getWishlist().subscribe({
      next: (items) => {
        this.items.set(items);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  moveToCart(item: WishlistItem) {
    this.marketplaceService.moveToCart(item.productId).subscribe(() => {
      this.items.update(i => i.filter(x => x.id !== item.id));
    });
  }

  remove(item: WishlistItem) {
    this.marketplaceService.removeFromWishlist(item.productId).subscribe(() => {
      this.items.update(i => i.filter(x => x.id !== item.id));
    });
  }
}
