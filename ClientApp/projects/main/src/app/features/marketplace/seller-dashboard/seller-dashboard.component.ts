import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MarketplaceService, Seller, SellerStats, Product, Order } from '../../../core/services/marketplace.service';

@Component({
  selector: 'app-seller-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div class="max-w-7xl mx-auto px-4 py-4">
          <div class="flex items-center justify-between">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Seller Dashboard</h1>
            <a routerLink="/marketplace/sell/new" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              New Listing
            </a>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 py-6">
        @if (!seller()) {
          <!-- Create Seller Profile -->
          <div class="bg-white dark:bg-gray-800 rounded-xl p-8 text-center max-w-lg mx-auto">
            <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Start Selling</h2>
            <p class="text-gray-600 dark:text-gray-400 mb-6">Create your seller profile to start listing products</p>
            
            <div class="space-y-4 text-left">
              <input type="text" [(ngModel)]="newSeller.storeName" placeholder="Store Name"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <textarea [(ngModel)]="newSeller.description" placeholder="Store Description" rows="3"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"></textarea>
              <select [(ngModel)]="newSeller.sellerType"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="Individual">Individual Seller</option>
                <option value="Dealer">Dealer</option>
                <option value="Vendor">Vendor</option>
              </select>
              <button (click)="createSellerProfile()" [disabled]="!newSeller.storeName"
                class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                Create Seller Profile
              </button>
            </div>
          </div>
        } @else {
          <!-- Stats Cards -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div class="bg-white dark:bg-gray-800 rounded-xl p-4">
              <div class="text-sm text-gray-500 dark:text-gray-400">Total Sales</div>
              <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats()?.totalSales || 0 }}</div>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-xl p-4">
              <div class="text-sm text-gray-500 dark:text-gray-400">Revenue</div>
              <div class="text-2xl font-bold text-gray-900 dark:text-white">USD {{ stats()?.totalRevenue || 0 | number:'1.0-0' }}</div>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-xl p-4">
              <div class="text-sm text-gray-500 dark:text-gray-400">Active Listings</div>
              <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats()?.activeListings || 0 }}</div>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-xl p-4">
              <div class="text-sm text-gray-500 dark:text-gray-400">Pending Orders</div>
              <div class="text-2xl font-bold text-orange-500">{{ stats()?.pendingOrders || 0 }}</div>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Store Info -->
            <div class="bg-white dark:bg-gray-800 rounded-xl p-6">
              <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Store Info</h3>
              <div class="flex items-center gap-4 mb-4">
                <img [src]="seller()!.logoUrl || 'assets/store-placeholder.png'" class="w-16 h-16 rounded-full object-cover">
                <div>
                  <div class="font-medium text-gray-900 dark:text-white">{{ seller()!.storeName }}</div>
                  <div class="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                    <span>{{ seller()!.rating.toFixed(1) }} ★</span>
                    <span>•</span>
                    <span>{{ seller()!.reviewCount }} reviews</span>
                  </div>
                </div>
              </div>
              <a [routerLink]="['/marketplace/seller', seller()!.slug || seller()!.id]" 
                class="text-blue-600 hover:underline text-sm">View Public Store</a>
            </div>

            <!-- Recent Orders -->
            <div class="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="font-semibold text-gray-900 dark:text-white">Recent Orders</h3>
                <a routerLink="/marketplace/orders" class="text-blue-600 hover:underline text-sm">View All</a>
              </div>
              @if (recentOrders().length) {
                <div class="space-y-3">
                  @for (order of recentOrders(); track order.id) {
                    <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <div class="font-medium text-gray-900 dark:text-white">{{ order.orderNumber }}</div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">{{ order.items.length }} items</div>
                      </div>
                      <div class="text-right">
                        <div class="font-medium text-gray-900 dark:text-white">USD {{ order.total | number:'1.2-2' }}</div>
                        <span class="text-xs px-2 py-1 rounded-full" [class]="getStatusClass(order.status)">
                          {{ order.status }}
                        </span>
                      </div>
                    </div>
                  }
                </div>
              } @else {
                <p class="text-gray-500 dark:text-gray-400 text-center py-4">No orders yet</p>
              }
            </div>
          </div>

          <!-- My Listings -->
          <div class="mt-6 bg-white dark:bg-gray-800 rounded-xl p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-semibold text-gray-900 dark:text-white">My Listings</h3>
              <a routerLink="/marketplace/sell/new" class="text-blue-600 hover:underline text-sm">Add New</a>
            </div>
            @if (myProducts().length) {
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead class="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th class="px-4 py-2 text-left">Product</th>
                      <th class="px-4 py-2 text-left">Price</th>
                      <th class="px-4 py-2 text-left">Stock</th>
                      <th class="px-4 py-2 text-left">Status</th>
                      <th class="px-4 py-2 text-left">Views</th>
                      <th class="px-4 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (product of myProducts(); track product.id) {
                      <tr class="border-b border-gray-200 dark:border-gray-700">
                        <td class="px-4 py-3">
                          <div class="flex items-center gap-3">
                            <img [src]="product.images[0]?.url || 'assets/product-placeholder.png'" class="w-10 h-10 rounded object-cover">
                            <span class="font-medium text-gray-900 dark:text-white truncate max-w-[200px]">{{ product.title }}</span>
                          </div>
                        </td>
                        <td class="px-4 py-3 text-gray-900 dark:text-white">{{ product.currency }} {{ product.price | number:'1.2-2' }}</td>
                        <td class="px-4 py-3" [class]="product.quantity > 0 ? 'text-green-600' : 'text-red-600'">{{ product.quantity }}</td>
                        <td class="px-4 py-3">
                          <span class="px-2 py-1 text-xs rounded-full" [class]="getListingStatusClass(product.status)">
                            {{ product.status }}
                          </span>
                        </td>
                        <td class="px-4 py-3 text-gray-500 dark:text-gray-400">{{ product.viewCount }}</td>
                        <td class="px-4 py-3">
                          <div class="flex items-center gap-2">
                            <a [routerLink]="['/marketplace/sell/edit', product.id]" class="text-blue-600 hover:underline">Edit</a>
                            <button (click)="deleteProduct(product)" class="text-red-600 hover:underline">Delete</button>
                          </div>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            } @else {
              <div class="text-center py-8">
                <p class="text-gray-500 dark:text-gray-400 mb-4">No listings yet</p>
                <a routerLink="/marketplace/sell/new" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Create Your First Listing
                </a>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `
})
export class SellerDashboardComponent implements OnInit {
  private marketplaceService = inject(MarketplaceService);

  seller = signal<Seller | null>(null);
  stats = signal<SellerStats | null>(null);
  myProducts = signal<Product[]>([]);
  recentOrders = signal<Order[]>([]);

  newSeller = { storeName: '', description: '', sellerType: 'Individual' as const };

  ngOnInit() {
    this.loadSellerProfile();
  }

  loadSellerProfile() {
    this.marketplaceService.getMySellerProfile().subscribe({
      next: (seller) => {
        this.seller.set(seller);
        this.loadStats();
        this.loadProducts(seller.id);
        this.loadOrders();
      },
      error: () => this.seller.set(null)
    });
  }

  loadStats() {
    this.marketplaceService.getMySellerStats().subscribe(stats => this.stats.set(stats));
  }

  loadProducts(sellerId: string) {
    this.marketplaceService.getSellerProducts(sellerId, 1, 10).subscribe(result => this.myProducts.set(result.items));
  }

  loadOrders() {
    this.marketplaceService.getMySales(1, 5).subscribe(result => this.recentOrders.set(result.items));
  }

  createSellerProfile() {
    if (!this.newSeller.storeName) return;
    this.marketplaceService.createSellerProfile(
      this.newSeller.storeName,
      this.newSeller.description,
      this.newSeller.sellerType
    ).subscribe(seller => {
      this.seller.set(seller);
      this.loadStats();
    });
  }

  deleteProduct(product: Product) {
    if (confirm('Are you sure you want to delete this listing?')) {
      this.marketplaceService.deleteProduct(product.id).subscribe(() => {
        this.myProducts.update(p => p.filter(x => x.id !== product.id));
      });
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      case 'Confirmed': case 'Processing': return 'bg-blue-100 text-blue-700';
      case 'Shipped': return 'bg-purple-100 text-purple-700';
      case 'Delivered': return 'bg-green-100 text-green-700';
      case 'Cancelled': case 'Refunded': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  getListingStatusClass(status: string): string {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-700';
      case 'Draft': return 'bg-gray-100 text-gray-700';
      case 'PendingApproval': return 'bg-yellow-100 text-yellow-700';
      case 'Sold': return 'bg-blue-100 text-blue-700';
      case 'Expired': case 'Suspended': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }
}
