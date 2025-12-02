import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MarketplaceService, Product, ProductReview } from '../../../core/services/marketplace.service';
import { ProductCardComponent } from '../shared/product-card.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ProductCardComponent],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      @if (loading()) {
        <div class="max-w-7xl mx-auto px-4 py-8">
          <div class="animate-pulse grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="aspect-square bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            <div>
              <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
              <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
            </div>
          </div>
        </div>
      } @else if (product()) {
        <div class="max-w-7xl mx-auto px-4 py-8">
          <!-- Breadcrumb -->
          <nav class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
            <a routerLink="/marketplace" class="hover:text-gray-700 dark:hover:text-gray-300">Marketplace</a>
            <span>/</span>
            <a [routerLink]="['/marketplace/category', product()!.category]" class="hover:text-gray-700 dark:hover:text-gray-300">{{ product()!.category }}</a>
            <span>/</span>
            <span class="text-gray-900 dark:text-white">{{ product()!.title }}</span>
          </nav>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Images -->
            <div>
              <div class="aspect-square bg-white dark:bg-gray-800 rounded-xl overflow-hidden mb-4">
                <img [src]="selectedImage() || product()!.images[0]?.url || 'assets/product-placeholder.png'" 
                  class="w-full h-full object-contain">
              </div>
              @if (product()!.images.length > 1) {
                <div class="flex gap-2 overflow-x-auto pb-2">
                  @for (img of product()!.images; track img.id) {
                    <button (click)="selectedImage.set(img.url)"
                      [class]="selectedImage() === img.url ? 'ring-2 ring-blue-500' : ''"
                      class="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
                      <img [src]="img.thumbnailUrl || img.url" class="w-full h-full object-cover">
                    </button>
                  }
                </div>
              }
            </div>

            <!-- Info -->
            <div>
              <div class="flex items-start justify-between">
                <div>
                  <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ product()!.title }}</h1>
                  @if (product()!.subtitle) {
                    <p class="text-gray-600 dark:text-gray-400 mt-1">{{ product()!.subtitle }}</p>
                  }
                </div>
                <button (click)="toggleWishlist()" 
                  [class]="product()!.isInWishlist ? 'text-red-500' : 'text-gray-400 hover:text-red-500'"
                  class="p-2">
                  <svg class="w-6 h-6" [attr.fill]="product()!.isInWishlist ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                  </svg>
                </button>
              </div>

              <!-- Rating -->
              @if (product()!.averageRating) {
                <div class="flex items-center gap-2 mt-3">
                  <div class="flex">
                    @for (star of [1,2,3,4,5]; track star) {
                      <svg class="w-5 h-5" [class]="star <= product()!.averageRating! ? 'text-yellow-400' : 'text-gray-300'" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    }
                  </div>
                  <span class="text-gray-600 dark:text-gray-400">{{ product()!.averageRating!.toFixed(1) }} ({{ product()!.reviewCount }} reviews)</span>
                </div>
              }

              <!-- Price -->
              <div class="mt-4">
                <div class="flex items-baseline gap-3">
                  <span class="text-3xl font-bold text-gray-900 dark:text-white">{{ product()!.currency }} {{ product()!.price | number:'1.2-2' }}</span>
                  @if (product()!.originalPrice && product()!.originalPrice! > product()!.price) {
                    <span class="text-lg text-gray-500 line-through">{{ product()!.currency }} {{ product()!.originalPrice! | number:'1.2-2' }}</span>
                    <span class="px-2 py-1 bg-red-100 text-red-700 text-sm font-medium rounded">Save {{ getDiscount() }}%</span>
                  }
                </div>
                @if (product()!.acceptsBestOffer) {
                  <p class="text-sm text-blue-600 mt-1">or Best Offer</p>
                }
              </div>

              <!-- Condition & Stock -->
              <div class="flex items-center gap-4 mt-4">
                <span class="px-3 py-1 rounded-full text-sm font-medium" [class]="getConditionClass()">
                  {{ product()!.condition }}
                </span>
                <span class="text-sm" [class]="product()!.quantity > 0 ? 'text-green-600' : 'text-red-600'">
                  {{ product()!.quantity > 0 ? product()!.quantity + ' in stock' : 'Out of stock' }}
                </span>
              </div>

              <!-- Quantity & Add to Cart -->
              <div class="mt-6 p-4 bg-white dark:bg-gray-800 rounded-xl">
                <div class="flex items-center gap-4 mb-4">
                  <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Quantity:</label>
                  <div class="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                    <button (click)="decrementQty()" class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">-</button>
                    <span class="px-4 py-2 border-x border-gray-300 dark:border-gray-600">{{ quantity() }}</span>
                    <button (click)="incrementQty()" class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">+</button>
                  </div>
                </div>
                <div class="flex gap-3">
                  <button (click)="addToCart()" [disabled]="product()!.quantity === 0"
                    class="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                    Add to Cart
                  </button>
                  <button (click)="buyNow()" [disabled]="product()!.quantity === 0"
                    class="px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed">
                    Buy Now
                  </button>
                </div>
              </div>

              <!-- Shipping -->
              <div class="mt-4 p-4 bg-white dark:bg-gray-800 rounded-xl">
                <div class="flex items-center gap-3 text-sm">
                  @if (product()!.freeShipping) {
                    <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    <span class="text-green-600 font-medium">Free Shipping</span>
                  } @else if (product()!.shippingCost) {
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                    </svg>
                    <span class="text-gray-600 dark:text-gray-400">Shipping: {{ product()!.currency }} {{ product()!.shippingCost | number:'1.2-2' }}</span>
                  }
                  @if (product()!.localPickupAvailable) {
                    <span class="text-gray-600 dark:text-gray-400">• Local pickup available</span>
                  }
                </div>
                @if (product()!.shipsFrom) {
                  <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">Ships from: {{ product()!.shipsFrom }}</p>
                }
              </div>

              <!-- Seller -->
              <a [routerLink]="['/marketplace/seller', product()!.seller.slug || product()!.seller.id]" 
                class="mt-4 p-4 bg-white dark:bg-gray-800 rounded-xl flex items-center gap-4 hover:shadow-md transition-shadow">
                <img [src]="product()!.seller.logoUrl || 'assets/store-placeholder.png'" 
                  class="w-12 h-12 rounded-full object-cover">
                <div class="flex-1">
                  <div class="flex items-center gap-2">
                    <span class="font-medium text-gray-900 dark:text-white">{{ product()!.seller.storeName }}</span>
                    @if (product()!.seller.isVerified) {
                      <svg class="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                      </svg>
                    }
                  </div>
                  <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>{{ product()!.seller.rating.toFixed(1) }} ★</span>
                    <span>•</span>
                    <span>{{ product()!.seller.reviewCount }} reviews</span>
                  </div>
                </div>
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </a>
            </div>
          </div>

          <!-- Tabs -->
          <div class="mt-12">
            <div class="flex gap-6 border-b border-gray-200 dark:border-gray-700">
              @for (tab of tabs; track tab.id) {
                <button (click)="activeTab.set(tab.id)"
                  [class]="activeTab() === tab.id 
                    ? 'pb-3 border-b-2 border-blue-600 text-blue-600 font-medium' 
                    : 'pb-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'">
                  {{ tab.label }}
                </button>
              }
            </div>

            <div class="py-6">
              @switch (activeTab()) {
                @case ('description') {
                  <div class="prose dark:prose-invert max-w-none">
                    <p class="whitespace-pre-wrap text-gray-700 dark:text-gray-300">{{ product()!.description }}</p>
                  </div>
                }
                @case ('specs') {
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    @if (product()!.brand) {
                      <div class="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                        <span class="text-gray-500 dark:text-gray-400">Brand</span>
                        <span class="text-gray-900 dark:text-white">{{ product()!.brand }}</span>
                      </div>
                    }
                    @if (product()!.partNumber) {
                      <div class="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                        <span class="text-gray-500 dark:text-gray-400">Part Number</span>
                        <span class="text-gray-900 dark:text-white">{{ product()!.partNumber }}</span>
                      </div>
                    }
                    @if (product()!.oemNumber) {
                      <div class="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                        <span class="text-gray-500 dark:text-gray-400">OEM Number</span>
                        <span class="text-gray-900 dark:text-white">{{ product()!.oemNumber }}</span>
                      </div>
                    }
                    @if (product()!.warrantyType !== 'None') {
                      <div class="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                        <span class="text-gray-500 dark:text-gray-400">Warranty</span>
                        <span class="text-gray-900 dark:text-white">{{ product()!.warrantyType }} - {{ product()!.warrantyMonths }} months</span>
                      </div>
                    }
                  </div>
                }
                @case ('compatibility') {
                  @if (product()!.isUniversal) {
                    <p class="text-gray-600 dark:text-gray-400">This is a universal fit product</p>
                  } @else if (product()!.compatibility.length) {
                    <div class="overflow-x-auto">
                      <table class="w-full text-sm">
                        <thead class="bg-gray-100 dark:bg-gray-800">
                          <tr>
                            <th class="px-4 py-2 text-left">Make</th>
                            <th class="px-4 py-2 text-left">Model</th>
                            <th class="px-4 py-2 text-left">Years</th>
                            <th class="px-4 py-2 text-left">Trim</th>
                          </tr>
                        </thead>
                        <tbody>
                          @for (comp of product()!.compatibility; track $index) {
                            <tr class="border-b border-gray-200 dark:border-gray-700">
                              <td class="px-4 py-2">{{ comp.make }}</td>
                              <td class="px-4 py-2">{{ comp.model }}</td>
                              <td class="px-4 py-2">{{ comp.yearFrom }} - {{ comp.yearTo || 'Present' }}</td>
                              <td class="px-4 py-2">{{ comp.trim || 'All' }}</td>
                            </tr>
                          }
                        </tbody>
                      </table>
                    </div>
                  } @else {
                    <p class="text-gray-600 dark:text-gray-400">No compatibility information available</p>
                  }
                }
                @case ('reviews') {
                  <p class="text-gray-600 dark:text-gray-400">Reviews coming soon</p>
                }
              }
            </div>
          </div>

          <!-- Related Products -->
          @if (relatedProducts().length) {
            <section class="mt-12">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6">Related Products</h2>
              <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                @for (p of relatedProducts(); track p.id) {
                  <app-product-card [product]="p" />
                }
              </div>
            </section>
          }
        </div>
      }
    </div>
  `
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private marketplaceService = inject(MarketplaceService);

  product = signal<Product | null>(null);
  relatedProducts = signal<Product[]>([]);
  selectedImage = signal<string | null>(null);
  quantity = signal(1);
  activeTab = signal<'description' | 'specs' | 'compatibility' | 'reviews'>('description');
  loading = signal(true);

  tabs = [
    { id: 'description' as const, label: 'Description' },
    { id: 'specs' as const, label: 'Specifications' },
    { id: 'compatibility' as const, label: 'Compatibility' },
    { id: 'reviews' as const, label: 'Reviews' }
  ];

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.loadProduct(params['id']);
    });
  }

  loadProduct(id: string) {
    this.loading.set(true);
    this.marketplaceService.getProduct(id).subscribe({
      next: (product) => {
        this.product.set(product);
        this.selectedImage.set(product.images[0]?.url || null);
        this.loading.set(false);
        this.loadRelated(id);
      },
      error: () => this.loading.set(false)
    });
  }

  loadRelated(productId: string) {
    this.marketplaceService.getRelatedProducts(productId, 5).subscribe(products => this.relatedProducts.set(products));
  }

  getDiscount(): number {
    if (!this.product()?.originalPrice) return 0;
    return Math.round((1 - this.product()!.price / this.product()!.originalPrice!) * 100);
  }

  getConditionClass(): string {
    const cond = this.product()?.condition;
    switch (cond) {
      case 'New': return 'bg-green-100 text-green-700';
      case 'LikeNew': return 'bg-blue-100 text-blue-700';
      case 'Excellent': return 'bg-teal-100 text-teal-700';
      case 'Good': return 'bg-yellow-100 text-yellow-700';
      case 'Fair': return 'bg-orange-100 text-orange-700';
      case 'ForParts': return 'bg-red-100 text-red-700';
      case 'Refurbished': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  incrementQty() {
    if (this.quantity() < (this.product()?.quantity || 1)) {
      this.quantity.update(q => q + 1);
    }
  }

  decrementQty() {
    if (this.quantity() > 1) {
      this.quantity.update(q => q - 1);
    }
  }

  addToCart() {
    if (!this.product()) return;
    this.marketplaceService.addToCart(this.product()!.id, this.quantity()).subscribe();
  }

  buyNow() {
    this.addToCart();
    window.location.href = '/marketplace/checkout';
  }

  toggleWishlist() {
    if (!this.product()) return;
    if (this.product()!.isInWishlist) {
      this.marketplaceService.removeFromWishlist(this.product()!.id).subscribe(() => {
        this.product.update(p => p ? { ...p, isInWishlist: false } : null);
      });
    } else {
      this.marketplaceService.addToWishlist(this.product()!.id).subscribe(() => {
        this.product.update(p => p ? { ...p, isInWishlist: true } : null);
      });
    }
  }
}
