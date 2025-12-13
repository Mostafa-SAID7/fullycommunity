import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MarketplaceService, Order } from '../../../core/services/commerce/marketplace.service';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div class="max-w-4xl mx-auto px-4 py-8">
        @if (loading()) {
          <div class="animate-pulse space-y-4">
            <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div class="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          </div>
        } @else if (order()) {
          <div class="flex items-center justify-between mb-6">
            <div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Order #{{ order()!.orderNumber }}</h1>
              <p class="text-gray-500 dark:text-gray-400">Placed on {{ order()!.createdAt | date:'medium' }}</p>
            </div>
            <span class="px-4 py-2 rounded-full text-sm font-medium" [class]="getStatusClass(order()!.status)">
              {{ order()!.status }}
            </span>
          </div>

          <!-- Order Progress -->
          <div class="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6">
            <div class="flex items-center justify-between">
              @for (step of orderSteps; track step.status; let i = $index) {
                <div class="flex flex-col items-center flex-1">
                  <div class="w-10 h-10 rounded-full flex items-center justify-center"
                    [class]="isStepComplete(step.status) ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'">
                    @if (isStepComplete(step.status)) {
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                    } @else {
                      <span>{{ i + 1 }}</span>
                    }
                  </div>
                  <span class="text-xs mt-2 text-gray-600 dark:text-gray-400">{{ step.label }}</span>
                </div>
                @if (i < orderSteps.length - 1) {
                  <div class="flex-1 h-1 mx-2" [class]="isStepComplete(orderSteps[i + 1].status) ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'"></div>
                }
              }
            </div>
          </div>

          <!-- Tracking -->
          @if (order()!.trackingNumber) {
            <div class="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-blue-600 dark:text-blue-400">Tracking Number</p>
                  <p class="font-medium text-blue-900 dark:text-blue-100">{{ order()!.trackingNumber }}</p>
                </div>
                @if (order()!.trackingUrl) {
                  <a [href]="order()!.trackingUrl" target="_blank" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Track Package
                  </a>
                }
              </div>
            </div>
          }

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Items -->
            <div class="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6">
              <h2 class="font-semibold text-gray-900 dark:text-white mb-4">Order Items</h2>
              <div class="space-y-4">
                @for (item of order()!.items; track item.id) {
                  <div class="flex gap-4">
                    <img [src]="item.productImage || 'assets/product-placeholder.png'" class="w-20 h-20 rounded-lg object-cover">
                    <div class="flex-1">
                      <p class="font-medium text-gray-900 dark:text-white">{{ item.productTitle }}</p>
                      <p class="text-sm text-gray-500 dark:text-gray-400">SKU: {{ item.sku }}</p>
                      <p class="text-sm text-gray-500 dark:text-gray-400">Qty: {{ item.quantity }}</p>
                    </div>
                    <div class="text-right">
                      <p class="font-medium text-gray-900 dark:text-white">{{ order()!.currency }} {{ item.total | number:'1.2-2' }}</p>
                    </div>
                  </div>
                }
              </div>
            </div>

            <!-- Summary -->
            <div class="space-y-6">
              <div class="bg-white dark:bg-gray-800 rounded-xl p-6">
                <h2 class="font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h2>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span class="text-gray-900 dark:text-white">{{ order()!.currency }} {{ order()!.subtotal | number:'1.2-2' }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">Shipping</span>
                    <span class="text-gray-900 dark:text-white">{{ order()!.currency }} {{ order()!.shippingCost | number:'1.2-2' }}</span>
                  </div>
                  @if (order()!.taxAmount > 0) {
                    <div class="flex justify-between">
                      <span class="text-gray-600 dark:text-gray-400">Tax</span>
                      <span class="text-gray-900 dark:text-white">{{ order()!.currency }} {{ order()!.taxAmount | number:'1.2-2' }}</span>
                    </div>
                  }
                  <div class="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700 font-semibold">
                    <span class="text-gray-900 dark:text-white">Total</span>
                    <span class="text-gray-900 dark:text-white">{{ order()!.currency }} {{ order()!.total | number:'1.2-2' }}</span>
                  </div>
                </div>
              </div>

              <div class="bg-white dark:bg-gray-800 rounded-xl p-6">
                <h2 class="font-semibold text-gray-900 dark:text-white mb-4">Shipping Address</h2>
                <div class="text-sm text-gray-600 dark:text-gray-400">
                  <p class="font-medium text-gray-900 dark:text-white">{{ order()!.shippingAddress.fullName }}</p>
                  <p>{{ order()!.shippingAddress.addressLine1 }}</p>
                  @if (order()!.shippingAddress.addressLine2) {
                    <p>{{ order()!.shippingAddress.addressLine2 }}</p>
                  }
                  <p>{{ order()!.shippingAddress.city }}, {{ order()!.shippingAddress.state }} {{ order()!.shippingAddress.postalCode }}</p>
                  <p>{{ order()!.shippingAddress.country }}</p>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class OrderDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private marketplaceService = inject(MarketplaceService);

  order = signal<Order | null>(null);
  loading = signal(true);

  orderSteps = [
    { status: 'Confirmed', label: 'Confirmed' },
    { status: 'Processing', label: 'Processing' },
    { status: 'Shipped', label: 'Shipped' },
    { status: 'Delivered', label: 'Delivered' }
  ];

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.loadOrder(params['id']);
    });
  }

  loadOrder(id: string) {
    this.marketplaceService.getOrder(id).subscribe({
      next: (order) => {
        this.order.set(order);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  isStepComplete(status: string): boolean {
    const order = this.order();
    if (!order) return false;
    const statusOrder = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];
    return statusOrder.indexOf(order.status) >= statusOrder.indexOf(status);
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
}
