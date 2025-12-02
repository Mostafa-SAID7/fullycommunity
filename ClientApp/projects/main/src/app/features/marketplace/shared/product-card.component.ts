import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product, MarketplaceService } from '../../../core/services/marketplace.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group">
      <a [routerLink]="['/marketplace/product', product.id]" class="block">
        <!-- Image -->
        <div class="relative aspect-square bg-gray-100 dark:bg-gray-700 overflow-hidden">
          <img [src]="product.images[0]?.url || 'assets/product-placeholder.png'" [alt]="product.title"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
          
          @if (product.originalPrice && product.originalPrice > product.price) {
            <div class="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-xs font-medium rounded">
              -{{ getDiscount() }}%
            </div>
          }
          
          @if (product.isFeatured) {
            <div class="absolute top-2 right-2 px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded">
              Featured
            </div>
          }
          
          @if (product.freeShipping) {
            <div class="absolute bottom-2 left-2 px-2 py-1 bg-green-500 text-white text-xs font-medium rounded">
              Free Shipping
            </div>
          }
        </div>

        <!-- Info -->
        <div class="p-4">
          <h3 class="font-medium text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 min-h-[48px]">
            {{ product.title }}
          </h3>
          
          <div class="flex items-center gap-2 mt-2">
            <span class="text-lg font-bold text-gray-900 dark:text-white">{{ product.currency }} {{ product.price | number:'1.2-2' }}</span>
            @if (product.originalPrice && product.originalPrice > product.price) {
              <span class="text-sm text-gray-500 line-through">{{ product.currency }} {{ product.originalPrice | number:'1.2-2' }}</span>
            }
          </div>

          @if (product.averageRating) {
            <div class="flex items-center gap-1 mt-2">
              <div class="flex">
                @for (star of [1,2,3,4,5]; track star) {
                  <svg class="w-4 h-4" [class]="star <= product.averageRating! ? 'text-yellow-400' : 'text-gray-300'" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                }
              </div>
              <span class="text-sm text-gray-500 dark:text-gray-400">({{ product.reviewCount }})</span>
            </div>
          }

          <div class="flex items-center justify-between mt-3">
            <span class="text-xs px-2 py-1 rounded-full" 
              [class]="getConditionClass()">
              {{ product.condition }}
            </span>
            <span class="text-xs text-gray-500 dark:text-gray-400">{{ product.quantity }} available</span>
          </div>
        </div>
      </a>

      <!-- Actions -->
      <div class="px-4 pb-4 flex gap-2">
        <button (click)="addToCart($event)" 
          class="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 flex items-center justify-center gap-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
          </svg>
          Add to Cart
        </button>
        <button (click)="toggleWishlist($event)" 
          [class]="product.isInWishlist ? 'text-red-500' : 'text-gray-400 hover:text-red-500'"
          class="p-2 border border-gray-200 dark:border-gray-600 rounded-lg">
          <svg class="w-5 h-5" [attr.fill]="product.isInWishlist ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
        </button>
      </div>
    </div>
  `
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  @Output() cartAdded = new EventEmitter<Product>();
  @Output() wishlistToggled = new EventEmitter<Product>();

  private marketplaceService = inject(MarketplaceService);

  getDiscount(): number {
    if (!this.product.originalPrice) return 0;
    return Math.round((1 - this.product.price / this.product.originalPrice) * 100);
  }

  getConditionClass(): string {
    const base = 'bg-opacity-20 ';
    switch (this.product.condition) {
      case 'New': return base + 'bg-green-500 text-green-700 dark:text-green-400';
      case 'LikeNew': return base + 'bg-blue-500 text-blue-700 dark:text-blue-400';
      case 'Excellent': return base + 'bg-teal-500 text-teal-700 dark:text-teal-400';
      case 'Good': return base + 'bg-yellow-500 text-yellow-700 dark:text-yellow-400';
      case 'Fair': return base + 'bg-orange-500 text-orange-700 dark:text-orange-400';
      case 'ForParts': return base + 'bg-red-500 text-red-700 dark:text-red-400';
      case 'Refurbished': return base + 'bg-purple-500 text-purple-700 dark:text-purple-400';
      default: return base + 'bg-gray-500 text-gray-700 dark:text-gray-400';
    }
  }

  addToCart(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.marketplaceService.addToCart(this.product.id).subscribe(() => {
      this.cartAdded.emit(this.product);
    });
  }

  toggleWishlist(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.product.isInWishlist) {
      this.marketplaceService.removeFromWishlist(this.product.id).subscribe(() => {
        this.product.isInWishlist = false;
        this.wishlistToggled.emit(this.product);
      });
    } else {
      this.marketplaceService.addToWishlist(this.product.id).subscribe(() => {
        this.product.isInWishlist = true;
        this.wishlistToggled.emit(this.product);
      });
    }
  }
}
