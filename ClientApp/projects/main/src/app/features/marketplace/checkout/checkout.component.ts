import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MarketplaceService, Cart, OrderAddress, ShippingMethod, PaymentMethod } from '../../../core/services/marketplace.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div class="max-w-6xl mx-auto px-4 py-8">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Checkout</h1>

        @if (loading()) {
          <div class="animate-pulse space-y-4">
            <div class="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            <div class="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          </div>
        } @else if (cart() && cart()!.items.length > 0) {
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2 space-y-6">
              <!-- Shipping Address -->
              <div class="bg-white dark:bg-gray-800 rounded-xl p-6">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Shipping Address</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" [(ngModel)]="address.fullName" placeholder="Full Name"
                    class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <input type="tel" [(ngModel)]="address.phoneNumber" placeholder="Phone Number"
                    class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <input type="text" [(ngModel)]="address.addressLine1" placeholder="Address Line 1" class="md:col-span-2
                    px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <input type="text" [(ngModel)]="address.addressLine2" placeholder="Address Line 2 (Optional)" class="md:col-span-2
                    px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <input type="text" [(ngModel)]="address.city" placeholder="City"
                    class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <input type="text" [(ngModel)]="address.state" placeholder="State/Province"
                    class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <input type="text" [(ngModel)]="address.postalCode" placeholder="Postal Code"
                    class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <input type="text" [(ngModel)]="address.country" placeholder="Country"
                    class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                </div>
              </div>

              <!-- Shipping Method -->
              <div class="bg-white dark:bg-gray-800 rounded-xl p-6">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Shipping Method</h2>
                <div class="space-y-3">
                  @for (method of shippingMethods; track method.id) {
                    <label class="flex items-center gap-4 p-4 border rounded-lg cursor-pointer"
                      [class]="selectedShipping === method.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'">
                      <input type="radio" name="shipping" [value]="method.id" [(ngModel)]="selectedShipping" class="text-blue-600">
                      <div class="flex-1">
                        <div class="font-medium text-gray-900 dark:text-white">{{ method.name }}</div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">{{ method.description }}</div>
                      </div>
                      <div class="font-medium text-gray-900 dark:text-white">
                        {{ method.price === 0 ? 'Free' : 'USD ' + method.price.toFixed(2) }}
                      </div>
                    </label>
                  }
                </div>
              </div>

              <!-- Payment Method -->
              <div class="bg-white dark:bg-gray-800 rounded-xl p-6">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Method</h2>
                <div class="space-y-3">
                  @for (method of paymentMethods; track method.id) {
                    <label class="flex items-center gap-4 p-4 border rounded-lg cursor-pointer"
                      [class]="selectedPayment === method.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'">
                      <input type="radio" name="payment" [value]="method.id" [(ngModel)]="selectedPayment" class="text-blue-600">
                      <div class="flex-1">
                        <div class="font-medium text-gray-900 dark:text-white">{{ method.name }}</div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">{{ method.description }}</div>
                      </div>
                    </label>
                  }
                </div>
              </div>
            </div>

            <!-- Order Summary -->
            <div class="lg:col-span-1">
              <div class="bg-white dark:bg-gray-800 rounded-xl p-6 sticky top-4">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h2>
                
                <div class="space-y-3 mb-4">
                  @for (item of cart()!.items; track item.id) {
                    <div class="flex gap-3">
                      <img [src]="item.product.images[0]?.url || 'assets/product-placeholder.png'" 
                        class="w-16 h-16 rounded object-cover">
                      <div class="flex-1 min-w-0">
                        <p class="text-sm text-gray-900 dark:text-white line-clamp-2">{{ item.product.title }}</p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Qty: {{ item.quantity }}</p>
                      </div>
                      <div class="text-sm font-medium text-gray-900 dark:text-white">
                        USD {{ item.total | number:'1.2-2' }}
                      </div>
                    </div>
                  }
                </div>

                <div class="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span class="text-gray-900 dark:text-white">USD {{ cart()!.subtotal | number:'1.2-2' }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">Shipping</span>
                    <span class="text-gray-900 dark:text-white">USD {{ getShippingCost() | number:'1.2-2' }}</span>
                  </div>
                  <div class="flex justify-between font-semibold text-lg pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span class="text-gray-900 dark:text-white">Total</span>
                    <span class="text-gray-900 dark:text-white">USD {{ getTotal() | number:'1.2-2' }}</span>
                  </div>
                </div>

                <button (click)="placeOrder()" [disabled]="!isValid() || processing()"
                  class="mt-6 w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
                  {{ processing() ? 'Processing...' : 'Place Order' }}
                </button>
              </div>
            </div>
          </div>
        } @else {
          <div class="text-center py-16">
            <p class="text-gray-500 dark:text-gray-400 mb-4">Your cart is empty</p>
            <a routerLink="/marketplace" class="px-6 py-3 bg-blue-600 text-white rounded-lg">Continue Shopping</a>
          </div>
        }
      </div>
    </div>
  `
})
export class CheckoutComponent implements OnInit {
  private router = inject(Router);
  private marketplaceService = inject(MarketplaceService);

  cart = signal<Cart | null>(null);
  loading = signal(true);
  processing = signal(false);

  address: OrderAddress = {
    fullName: '', addressLine1: '', city: '', postalCode: '', country: ''
  };

  selectedShipping: ShippingMethod = 'Standard';
  selectedPayment: PaymentMethod = 'Card';

  shippingMethods = [
    { id: 'Standard' as ShippingMethod, name: 'Standard Shipping', description: '5-7 business days', price: 9.99 },
    { id: 'Express' as ShippingMethod, name: 'Express Shipping', description: '2-3 business days', price: 19.99 },
    { id: 'Overnight' as ShippingMethod, name: 'Overnight', description: 'Next business day', price: 39.99 },
    { id: 'Pickup' as ShippingMethod, name: 'Local Pickup', description: 'Pick up from seller', price: 0 }
  ];

  paymentMethods = [
    { id: 'Card' as PaymentMethod, name: 'Credit/Debit Card', description: 'Visa, Mastercard, Amex' },
    { id: 'BankTransfer' as PaymentMethod, name: 'Bank Transfer', description: 'Direct bank transfer' }
  ];

  ngOnInit() {
    this.marketplaceService.getCart().subscribe({
      next: (cart) => {
        this.cart.set(cart);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  getShippingCost(): number {
    return this.shippingMethods.find(m => m.id === this.selectedShipping)?.price || 0;
  }

  getTotal(): number {
    return (this.cart()?.subtotal || 0) + this.getShippingCost();
  }

  isValid(): boolean {
    return !!(this.address.fullName && this.address.addressLine1 && this.address.city && 
              this.address.postalCode && this.address.country && this.cart()?.items.length);
  }

  placeOrder() {
    if (!this.isValid() || !this.cart()) return;
    
    this.processing.set(true);
    this.marketplaceService.createOrder({
      items: this.cart()!.items.map(i => ({ productId: i.productId, quantity: i.quantity })),
      shippingAddress: this.address,
      shippingMethod: this.selectedShipping,
      paymentMethod: this.selectedPayment
    }).subscribe({
      next: (order) => {
        this.router.navigate(['/marketplace/order', order.id]);
      },
      error: () => this.processing.set(false)
    });
  }
}
