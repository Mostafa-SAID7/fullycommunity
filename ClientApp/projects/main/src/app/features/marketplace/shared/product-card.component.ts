import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product, MarketplaceService } from '../../../core/services/commerce/marketplace.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Microsoft Fluent Design Product Card -->
    <div class="group bg-white dark:bg-gray-800/50 rounded-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-lg transition-all">
      <a [routerLink]="['/marketplace/product', product.id]" class="block">
        <!-- Image Container -->
        <div class="relative aspect-square bg-gray-100 dark:bg-gray-800 overflow-hidden">
          <img [src]="product.images[0]?.url || 'assets/product-placeholder.png'" [alt]="product.title"
            class="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-200 ease-out">
          
          <!-- Badges -->
          <div class="absolute top-2 left-2 flex flex-col gap-1.5">
            @if (product.originalPrice && product.originalPrice > product.price) {
              <span class="px-2 py-0.5 bg-red-600 text-white text-xs font-semibold rounded">
                -{{ getDiscount() }}%
              </span>
            }
            @if (product.isFeatured) {
              <span class="px-2 py-0.5 bg-yellow-500 text-white text-xs font-semibold rounded">
                Featured
              </span>
            }
          </div>
          
          @if (product.freeShipping) {
            <span class="absolute bottom-2 left-2 px-2 py-0.5 bg-green-600 text-white text-xs font-medium rounded">
              Free Shipping
            </span>
          }

          <!-- Wishlist Button Overlay -->
          <button (click)="toggleWishlist($event)" 
            class="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
            [class.opacity-100]="product.isInWishlist"
            [class.text-red-500]="product.isInWishlist"
            [class.text-gray-400]="!product.isInWishlist">
            <svg class="w-4 h-4" [attr.fill]="product.isInWishlist ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
          </button>
        </div>

        <!-- Product Info -->
        <div class="p-3">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 min-h-[40px] group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {{ product.title }}
          </h3>
          
          <!-- Price -->
          <div class="flex items-baseline gap-2 mt-2">
            <span class="text-base font-bold text-gray-900 dark:text-white">{{ product.currency }} {{ product.price | number:'1.2-2' }}</span>
            @if (product.originalPrice && product.originalPrice > product.price) {
              <span class="text-xs text-gray-500 line-through">{{ product.currency }} {{ product.originalPrice | number:'1.2-2' }}</span>
            }
          </div>

          <!-- Rating -->
          @if (product.averageRating) {
            <div class="flex items-center gap-1.5 mt-2">
              <div class="flex">
                @for (star of [1,2,3,4,5]; track star) {
                  <svg class="w-3.5 h-3.5" [class]="star <= product.averageRating! ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                }
              </div>
              <span class="text-xs text-gray-500 dark:text-gray-400">({{ product.reviewCount }})</span>
            </div>
          }

          <!-- Condition & Stock -->
          <div class="flex items-center justify-between mt-3">
            <span class="text-xs font-medium px-2 py-0.5 rounded" [class]="getConditionClass()">
              {{ product.condition }}
            </span>
            <span class="text-xs text-gray-500 dark:text-gray-400">{{ product.quantity }} left</span>
          </div>
        </div>
      </a>

      <!-- Add to Cart Button -->
      <div class="px-3 pb-3">
        <button (click)="addToCart($event)" 
          class="w-full h-9 flex items-center justify-center gap-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
          </svg>
          Add to Cart
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
