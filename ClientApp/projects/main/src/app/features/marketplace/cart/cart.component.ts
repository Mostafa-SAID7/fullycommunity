import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MarketplaceService, Cart, CartItem } from '../../../core/services/commerce/marketplace.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div class="max-w-6xl mx-auto px-4 py-8">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Shopping Cart</h1>

        @if (loading()) {
          <div class="animate-pulse space-y-4">
            @for (i of [1,2,3]; track i) {
              <div class="bg-white dark:bg-gray-800 rounded-xl p-4 flex gap-4">
                <div class="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div class="flex-1">
                  <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            }
          </div>
        } @else if (cart() && cart()!.items.length > 0) {
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Cart Items -->
            <div class="lg:col-span-2 space-y-4">
              @for (item of cart()!.items; track item.id) {
                <div class="bg-white dark:bg-gray-800 rounded-xl p-4 flex gap-4">
                  <a [routerLink]="['/marketplace/product', item.productId]" class="flex-shrink-0">
                    <img [src]="item.product.images[0]?.url || 'assets/product-placeholder.png'" 
                      class="w-24 h-24 rounded-lg object-cover">
                  </a>
                  <div class="flex-1 min-w-0">
                    <a [routerLink]="['/marketplace/product', item.productId]" 
                      class="font-medium text-gray-900 dark:text-white hover:text-blue-600 line-clamp-2">
                      {{ item.product.title }}
                    </a>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Condition: {{ item.product.condition }}
                    </p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      Seller: {{ item.product.seller.storeName }}
                    </p>
                    
                    <div class="flex items-center justify-between mt-3">
                      <div class="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                        <button (click)="updateQuantity(item, item.quantity - 1)" 
                          [disabled]="item.quantity <= 1"
                          class="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50">-</button>
                        <span class="px-3 py-1 border-x border-gray-300 dark:border-gray-600">{{ item.quantity }}</span>
                        <button (click)="updateQuantity(item, item.quantity + 1)"
                          [disabled]="item.quantity >= item.product.quantity"
                          class="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50">+</button>
                      </div>
                      <span class="font-bold text-gray-900 dark:text-white">
                        {{ item.product.currency }} {{ item.total | number:'1.2-2' }}
                      </span>
                    </div>
                  </div>
                  <button (click)="removeItem(item)" class="p-2 text-gray-400 hover:text-red-500">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              }
              
              <div class="flex justify-between items-center pt-4">
                <button (click)="clearCart()" class="text-red-600 hover:underline text-sm">
                  Clear Cart
                </button>
                <a routerLink="/marketplace" class="text-blue-600 hover:underline text-sm">
                  Continue Shopping
                </a>
              </div>
            </div>

            <!-- Order Summary -->
            <div class="lg:col-span-1">
              <div class="bg-white dark:bg-gray-800 rounded-xl p-6 sticky top-4">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h2>
                
                <div class="space-y-3 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">Subtotal ({{ cart()!.itemCount }} items)</span>
                    <span class="text-gray-900 dark:text-white">USD {{ cart()!.subtotal | number:'1.2-2' }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">Shipping</span>
                    <span class="text-gray-900 dark:text-white">
                      {{ cart()!.shippingTotal > 0 ? 'USD ' + (cart()!.shippingTotal | number:'1.2-2') : 'Free' }}
                    </span>
                  </div>
                  @if (cart()!.taxTotal > 0) {
                    <div class="flex justify-between">
                      <span class="text-gray-600 dark:text-gray-400">Tax</span>
                      <span class="text-gray-900 dark:text-white">USD {{ cart()!.taxTotal | number:'1.2-2' }}</span>
                    </div>
                  }
                  <div class="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between">
                    <span class="font-semibold text-gray-900 dark:text-white">Total</span>
                    <span class="font-bold text-xl text-gray-900 dark:text-white">USD {{ cart()!.total | number:'1.2-2' }}</span>
                  </div>
                </div>

                <a routerLink="/marketplace/checkout" 
                  class="mt-6 w-full block text-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
                  Proceed to Checkout
                </a>

                <div class="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                  Secure checkout
                </div>
              </div>
            </div>
          </div>
        } @else {
          <div class="text-center py-16">
            <svg class="w-24 h-24 mx-auto text-gray-300 dark:text-gray-600 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Your cart is empty</h2>
            <p class="text-gray-500 dark:text-gray-400 mb-6">Looks like you haven't added anything to your cart yet</p>
            <a routerLink="/marketplace" class="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
              Start Shopping
            </a>
          </div>
        }
      </div>
    </div>
  `
})
export class CartComponent implements OnInit {
  private marketplaceService = inject(MarketplaceService);

  cart = signal<Cart | null>(null);
  loading = signal(true);

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.marketplaceService.getCart().subscribe({
      next: (cart) => {
        this.cart.set(cart);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  updateQuantity(item: CartItem, quantity: number) {
    if (quantity < 1 || quantity > item.product.quantity) return;
    this.marketplaceService.updateCartItem(item.id, quantity).subscribe(() => {
      this.loadCart();
    });
  }

  removeItem(item: CartItem) {
    this.marketplaceService.removeFromCart(item.id).subscribe(() => {
      this.loadCart();
    });
  }

  clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
      this.marketplaceService.clearCart().subscribe(() => {
        this.cart.set({ items: [], subtotal: 0, shippingTotal: 0, taxTotal: 0, total: 0, itemCount: 0 });
      });
    }
  }
}
