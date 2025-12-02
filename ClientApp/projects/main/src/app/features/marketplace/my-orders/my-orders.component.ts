import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MarketplaceService, Order, OrderStatus } from '../../../core/services/marketplace.service';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div class="max-w-6xl mx-auto px-4 py-8">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Orders</h1>

        <!-- Tabs -->
        <div class="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-700">
          <button (click)="activeTab.set('purchases')"
            [class]="activeTab() === 'purchases' ? 'pb-3 border-b-2 border-blue-600 text-blue-600 font-medium' : 'pb-3 text-gray-600 dark:text-gray-400'">
            Purchases
          </button>
          <button (click)="activeTab.set('sales')"
            [class]="activeTab() === 'sales' ? 'pb-3 border-b-2 border-blue-600 text-blue-600 font-medium' : 'pb-3 text-gray-600 dark:text-gray-400'">
            Sales
          </button>
        </div>

        @if (loading()) {
          <div class="space-y-4">
            @for (i of [1,2,3]; track i) {
              <div class="animate-pulse bg-white dark:bg-gray-800 rounded-xl p-4">
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </div>
            }
          </div>
        } @else if (orders().length) {
          <div class="space-y-4">
            @for (order of orders(); track order.id) {
              <a [routerLink]="['/marketplace/order', order.id]" 
                class="block bg-white dark:bg-gray-800 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div class="flex items-center justify-between mb-3">
                  <div>
                    <span class="font-medium text-gray-900 dark:text-white">Order #{{ order.orderNumber }}</span>
                    <span class="text-sm text-gray-500 dark:text-gray-400 ml-2">{{ order.createdAt | date:'mediumDate' }}</span>
                  </div>
                  <span class="px-3 py-1 text-sm rounded-full" [class]="getStatusClass(order.status)">
                    {{ order.status }}
                  </span>
                </div>
                <div class="flex items-center gap-4">
                  <div class="flex -space-x-2">
                    @for (item of order.items.slice(0, 3); track item.id) {
                      <img [src]="item.productImage || 'assets/product-placeholder.png'" 
                        class="w-12 h-12 rounded border-2 border-white dark:border-gray-800 object-cover">
                    }
                    @if (order.items.length > 3) {
                      <div class="w-12 h-12 rounded border-2 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm text-gray-600 dark:text-gray-400">
                        +{{ order.items.length - 3 }}
                      </div>
                    }
                  </div>
                  <div class="flex-1">
                    <p class="text-sm text-gray-600 dark:text-gray-400">{{ order.items.length }} item(s)</p>
                  </div>
                  <div class="text-right">
                    <div class="font-bold text-gray-900 dark:text-white">{{ order.currency }} {{ order.total | number:'1.2-2' }}</div>
                  </div>
                </div>
                @if (order.trackingNumber) {
                  <div class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400">
                    Tracking: {{ order.trackingNumber }}
                  </div>
                }
              </a>
            }
          </div>

          @if (hasMore()) {
            <div class="text-center mt-6">
              <button (click)="loadMore()" class="px-6 py-2 bg-white dark:bg-gray-800 rounded-lg">Load More</button>
            </div>
          }
        } @else {
          <div class="text-center py-16">
            <svg class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">No orders yet</h2>
            <p class="text-gray-500 dark:text-gray-400 mb-6">Your orders will appear here</p>
            <a routerLink="/marketplace" class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Start Shopping
            </a>
          </div>
        }
      </div>
    </div>
  `
})
export class MyOrdersComponent implements OnInit {
  private marketplaceService = inject(MarketplaceService);

  orders = signal<Order[]>([]);
  activeTab = signal<'purchases' | 'sales'>('purchases');
  loading = signal(true);
  hasMore = signal(true);
  page = 1;

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.loading.set(true);
    this.page = 1;
    const request = this.activeTab() === 'purchases' 
      ? this.marketplaceService.getMyPurchases(1, 20)
      : this.marketplaceService.getMySales(1, 20);
    
    request.subscribe({
      next: (result) => {
        this.orders.set(result.items);
        this.hasMore.set(result.page < result.totalPages);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  loadMore() {
    this.page++;
    const request = this.activeTab() === 'purchases' 
      ? this.marketplaceService.getMyPurchases(this.page, 20)
      : this.marketplaceService.getMySales(this.page, 20);
    
    request.subscribe(result => {
      this.orders.update(o => [...o, ...result.items]);
      this.hasMore.set(result.page < result.totalPages);
    });
  }

  getStatusClass(status: OrderStatus): string {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      case 'Confirmed': case 'Processing': return 'bg-blue-100 text-blue-700';
      case 'Shipped': return 'bg-purple-100 text-purple-700';
      case 'Delivered': return 'bg-green-100 text-green-700';
      case 'Cancelled': case 'Refunded': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }
}
